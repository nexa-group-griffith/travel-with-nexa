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

    const { itemId, itemType, item }: AddToWishlistRequest =
      await request.json();

    if (!itemId || !itemType || !item) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          item: {} as WishlistItem,
        },
        { status: 400 }
      );
    }

    // Create wishlist item
    const wishlistItem: WishlistItem = {
      ...item,
      id: itemId,
      type: itemType,
      addedAt: new Date().toISOString(),
    };

    // Add to user's wishlist
    await updateDoc(doc(db, 'users', userId), {
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
