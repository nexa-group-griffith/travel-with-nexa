import { type NextRequest, NextResponse } from 'next/server';
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function DELETE(request: NextRequest) {
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

    // Use a batch to delete user data
    const batch = writeBatch(db);

    // Delete user's trips
    const tripsRef = collection(db, 'users', userId, 'trips');
    const tripsSnapshot = await getDocs(tripsRef);
    tripsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user's wishlist items if stored as subcollection
    try {
      const wishlistRef = collection(db, 'users', userId, 'wishlist');
      const wishlistSnapshot = await getDocs(wishlistRef);
      wishlistSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    } catch (error) {
      // Wishlist might not exist as a subcollection, continue
      console.log('No wishlist subcollection found');
    }

    // Commit the batch delete
    await batch.commit();

    // Delete the user document
    await deleteDoc(doc(db, 'users', userId));

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete account' },
      { status: 500 }
    );
  }
}
