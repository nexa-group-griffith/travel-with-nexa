import { type NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
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

    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const settings = userData.settings || {
      notifications: {
        email: true,
        tripReminders: true,
        marketingEmails: false,
        appNotifications: true,
      },
      display: {
        currency: 'USD',
        temperatureUnit: 'celsius',
        distanceUnit: 'km',
        language: 'en',
      },
      privacy: {
        shareTrips: false,
        shareReviews: true,
        publicProfile: false,
      },
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const data = await request.json();
    const { settings } = data;

    if (!settings) {
      return NextResponse.json(
        { success: false, message: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Update user document with settings
    await updateDoc(doc(db, 'users', userId), {
      settings,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
