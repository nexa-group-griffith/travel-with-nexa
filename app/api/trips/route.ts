import { type NextRequest, NextResponse } from 'next/server';
import type {
  TripsResponse,
  TripCreateResponse,
  Trip,
  TripRequest,
} from '@/types/trips';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest
): Promise<NextResponse<TripsResponse>> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', trips: [] },
        { status: 401 }
      );
    }

    const userId = authHeader.split('Bearer ')[1];
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', trips: [] },
        { status: 401 }
      );
    }

    let tripsQuery = query(
      collection(db, 'users', userId, 'trips'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(tripsQuery);
    const trips: Trip[] = [];

    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() } as Trip);
    });

    return NextResponse.json({
      success: true,
      trips,
    });
  } catch (error: any) {
    console.error('Get trips error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch trips',
        trips: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<TripCreateResponse>> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', trip: {} as Trip },
        { status: 401 }
      );
    }

    const userId = authHeader.split('Bearer ')[1]; // Extract token from "Bearer <token>"
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', trip: {} as Trip },
        { status: 401 }
      );
    }

    const tripData: TripRequest = await request.json();

    // Calculate number of days
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Create new trip document
    const newTrip = {
      userId: userId,
      destination: {
        id: crypto.randomUUID(), // Generate a unique ID for the destination
        name: tripData.destination,
        country: '', // This would be populated from a places API
        photos: [],
        coordinates: {
          lat: 0,
          lng: 0,
        },
        timezone: 'UTC',
        formatted_address: tripData.destination,
      },
      dates: {
        start: tripData.startDate,
        end: tripData.endDate,
        days,
      },
      travelers: tripData.travelers,
      budget: tripData.budget,
      interests: tripData.interests,
      createdAt: new Date().toISOString(),
      status: 'planned',
      itinerary: {
        overview: `Trip to ${tripData.destination}`,
        days: [],
      },
    };

    const docRef = await addDoc(
      collection(db, 'users', userId, 'trips'),
      newTrip
    );

    return NextResponse.json({
      success: true,
      trip: {
        id: docRef.id,
        ...newTrip,
      } as Trip,
    });
  } catch (error: any) {
    console.error('Create trip error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create trip',
        trip: {} as Trip,
      },
      { status: 500 }
    );
  }
}
