import { type NextRequest, NextResponse } from 'next/server';
import type { RemoveFromWishlistResponse } from '@/types/wishlist';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<RemoveFromWishlistResponse>> {
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

    const itemId = params.id;
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const wishlist = userData.wishlist || [];

    // Find the item to remove
    const itemToRemove = wishlist.find((item: any) => item.id === itemId);

    if (!itemToRemove) {
      return NextResponse.json(
        { success: false, message: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    // Remove from wishlist
    await updateDoc(doc(db, 'users', userId), {
      wishlist: arrayRemove(itemToRemove),
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
    });
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to remove from wishlist',
      },
      { status: 500 }
    );
  }
}
