'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '@/lib/wishlist-service';
import { useAuth } from '@/lib/use-auth';
import { useRouter } from 'next/navigation';
import type { WishlistItem } from '@/types/wishlist';

interface WishlistButtonProps {
  itemId: string;
  itemType: 'destination' | 'hotel' | 'restaurant' | 'attraction';
  itemData: Omit<WishlistItem, 'type' | 'addedAt'>;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function WishlistButton({
  itemId,
  itemType,
  itemData,
  variant = 'outline',
  size = 'sm',
  className = '',
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const result = await wishlistService.isInWishlist(itemId);
        setIsInWishlist(result);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWishlist();
  }, [itemId, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to save items to your wishlist',
        variant: 'destructive',
      });
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await wishlistService.removeFromWishlist(itemId);
        if (response.success) {
          setIsInWishlist(false);
          toast({
            title: 'Removed from wishlist',
            description: `${itemData.name} has been removed from your wishlist`,
          });
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to remove from wishlist',
            variant: 'destructive',
          });
        }
      } else {
        // Add to wishlist
        const response = await wishlistService.addToWishlist({
          itemId,
          itemType,
          item: itemData,
        });

        if (response.success) {
          setIsInWishlist(true);
          toast({
            title: 'Added to wishlist',
            description: `${itemData.name} has been added to your wishlist`,
          });
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to add to wishlist',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        className={`${className || ''} ${
          isInWishlist
            ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900'
            : ''
        }`}
        onClick={handleToggleWishlist}
        disabled={isLoading}
      >
        <Heart
          className={`h-4 w-4 ${
            isInWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'
          } ${size !== 'icon' ? 'mr-2' : ''}`}
        />
        {size !== 'icon' && (isInWishlist ? 'Saved' : 'Save')}
      </Button>
    </div>
  );
}
