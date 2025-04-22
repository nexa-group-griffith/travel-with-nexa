import { type NextRequest, NextResponse } from 'next/server';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authHeader.split('Bearer ')[1];
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get current user document
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Delete old profile photo in parallel if it exists
    const deleteOldPhoto =
      userData.photoURL && userData.photoURL.includes('firebasestorage')
        ? deleteObject(ref(storage, userData.photoURL))
        : Promise.resolve();

    // Create a unique filename and upload new file
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-photos/${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    const uploadFile = uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    // Execute deletion and upload in parallel
    await Promise.all([deleteOldPhoto, uploadFile]);

    // Get download URL after upload is completed
    const photoURL = await getDownloadURL(storageRef);

    // Update user profile in Firebase Auth and Firestore in parallel
    const updateAuthProfile = auth.currentUser
      ? updateProfile(auth.currentUser, { photoURL })
      : Promise.resolve();
    const updateFirestoreDoc = updateDoc(doc(db, 'users', userId), {
      photoURL,
      updatedAt: new Date().toISOString(),
    });

    await Promise.all([updateAuthProfile, updateFirestoreDoc]);

    return NextResponse.json({
      success: true,
      photoURL,
      message: 'Profile photo updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile photo error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update profile photo',
      },
      { status: 500 }
    );
  }
}
