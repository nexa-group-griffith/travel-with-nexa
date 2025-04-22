import { type NextRequest, NextResponse } from 'next/server';
import type {
  WishlistResponse,
  AddToWishlistRequest,
  AddToWishlistResponse,
  WishlistItem,
} from '@/types/wishlist';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function GET(
  request: NextRequest
): Promise<NextResponse<WishlistResponse>> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', items: [] },
        { status: 401 }
      );
    }
    const userId = authHeader.split('Bearer ')[1];
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', items: [] },
        { status: 401 }
      );
    }

    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: 'User not found', items: [] },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const wishlistItems = userData.wishlist || [];

    return NextResponse.json({
      success: true,
      items: wishlistItems,
    });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch wishlist',
        items: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AddToWishlistResponse>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', item: {} as WishlistItem },
        { status: 401 }
      );
    }

    const { destinationId }: AddToWishlistRequest = await request.json();

    if (!destinationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Destination ID is required',
          item: {} as WishlistItem,
        },
        { status: 400 }
      );
    }

    // Get destination details
    const destinationDoc = await getDoc(doc(db, 'destinations', destinationId));

    if (!destinationDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Destination not found',
          item: {} as WishlistItem,
        },
        { status: 404 }
      );
    }

    const destination = destinationDoc.data();

    // Create wishlist item
    const wishlistItem: WishlistItem = {
      id: destinationId,
      name: destination.name,
      country: destination.country,
      city: destination.city,
      image: destination.imageUrl || '',
      description: destination.description || '',
      addedAt: new Date().toISOString(),
      coordinates: destination.coordinates,
      tags: destination.tags,
    };

    // Add to user's wishlist
    await updateDoc(doc(db, 'users', user.uid), {
      wishlist: arrayUnion(wishlistItem),
    });

    return NextResponse.json({
      success: true,
      item: wishlistItem,
    });
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to add to wishlist',
        item: {} as WishlistItem,
      },
      { status: 500 }
    );
  }
}
