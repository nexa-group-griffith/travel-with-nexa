'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, MapPin, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '@/lib/wishlist-service';
import { authService } from '@/lib/auth-service';
import type { WishlistItem } from '@/types/wishlist';

export default function WishlistPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login?redirect=/wishlist');
      return;
    }

    // Fetch wishlist
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await wishlistService.getWishlist();

        if (response.success) {
          setWishlistItems(response.items);
        } else {
          setError(response.message || 'Failed to load wishlist');
          toast({
            title: 'Error',
            description: response.message || 'Failed to load wishlist',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        setError(error.message || 'Failed to load wishlist');
        toast({
          title: 'Error',
          description: error.message || 'Failed to load wishlist',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router, toast]);

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await wishlistService.removeFromWishlist(itemId);

      if (response.success) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
        toast({
          title: 'Removed from wishlist',
          description: 'Destination has been removed from your wishlist',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to remove from wishlist',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove from wishlist',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>My Wishlist</h1>
        <p className='text-muted-foreground'>Places you want to visit</p>
      </div>

      {error && (
        <Alert
          variant='destructive'
          className='mb-6'
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {wishlistItems?.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {wishlistItems.map((destination) => (
            <Card
              key={destination.id}
              className='overflow-hidden hover:shadow-lg transition-all'
            >
              <div className='relative'>
                <div className='relative h-48 w-full overflow-hidden'>
                  <Image
                    src={
                      destination.image ||
                      '/placeholder.svg?height=200&width=300&query=destination'
                    }
                    alt={destination.name}
                    fill
                    className='object-cover transition-transform duration-300'
                  />
                </div>
                <Button
                  size='icon'
                  variant='destructive'
                  className='absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background'
                  onClick={() => removeFromWishlist(destination.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
              <CardContent className='p-4'>
                <h3 className='mb-1 font-semibold'>{destination.name}</h3>
                <div className='mb-3 flex items-center text-sm text-muted-foreground'>
                  <MapPin className='mr-1 h-3 w-3' />
                  {destination.country}
                </div>
                <p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>
                  {destination.description}
                </p>
                <div className='flex gap-2'>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='flex-1'
                  >
                    <Link href={`/destinations/${destination.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size='sm'
                    className='flex-1'
                  >
                    <Link href={`/plan-trip?destination=${destination.id}`}>
                      Plan Trip
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
            <Heart className='mb-4 h-12 w-12 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>
              Your wishlist is empty
            </h3>
            <p className='mb-4 text-muted-foreground'>
              Save places you'd like to visit
            </p>
            <Button asChild>
              <Link href='/destinations'>Discover Places</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
