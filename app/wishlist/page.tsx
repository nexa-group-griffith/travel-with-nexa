'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  MapPin,
  Loader2,
  Trash2,
  Hotel,
  UtensilsCrossed,
  CompassIcon,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '@/lib/wishlist-service';
import { authService } from '@/lib/auth-service';
import type { WishlistItem } from '@/types/wishlist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response: any = await wishlistService.getWishlist();

        if (response.success) {
          setWishlistItems(response?.data?.items || []);
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
          description: 'Item has been removed from your wishlist',
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

  const destinations = wishlistItems.filter(
    (item) => item.type === 'destination'
  );
  const hotels = wishlistItems.filter((item) => item.type === 'hotel');
  const restaurants = wishlistItems.filter(
    (item) => item.type === 'restaurant'
  );
  const attractions = wishlistItems.filter(
    (item) => item.type === 'attraction'
  );

  if (loading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }
  console.log('destinations', destinations, wishlistItems);
  const renderWishlistCard = (item: WishlistItem) => (
    <Card
      key={item.id}
      className='overflow-hidden hover:shadow-lg transition-all'
    >
      <div className='relative'>
        <div className='relative h-48 w-full overflow-hidden'>
          <Image
            src={
              item.image ||
              '/placeholder.svg?height=200&width=300&query=destination'
            }
            alt={item.name}
            fill
            className='object-cover transition-transform duration-300'
          />
        </div>
        <Button
          size='icon'
          variant='destructive'
          className='absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background'
          onClick={() => removeFromWishlist(item.id)}
        >
          <Trash2 className='h-4 w-4 fill-red-500 text-red-500' />
        </Button>
      </div>
      <CardContent className='p-4'>
        <h3 className='mb-1 font-semibold'>{item.name}</h3>
        <div className='mb-3 flex items-center text-sm text-muted-foreground'>
          <MapPin className='mr-1 h-3 w-3' />
          {item.country}
          {item.city ? `, ${item.city}` : ''}
        </div>
        {item.rating && (
          <div className='mb-3 flex items-center text-sm'>
            <div className='flex items-center'>
              <span className='text-yellow-500 mr-1'>★</span>
              <span>{item.rating}</span>
            </div>
          </div>
        )}
        {item.price && (
          <div className='mb-3 text-sm'>
            <span className='font-medium'>Price:</span> {item.price}
          </div>
        )}
        <p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>
          {item.description}
        </p>
        <div className='flex gap-2'>
          {item.type === 'destination' && (
            <>
              <Button
                asChild
                variant='outline'
                size='sm'
                className='flex-1'
              >
                <Link href={`/destinations/${item.id}`}>View Details</Link>
              </Button>
              <Button
                asChild
                size='sm'
                className='flex-1'
              >
                <Link href={`/plan-trip?destination=${item.id}`}>
                  Plan Trip
                </Link>
              </Button>
            </>
          )}
          {item.type === 'hotel' && (
            <Button
              asChild
              size='sm'
              className='flex-1'
            >
              <Link href={`/hotels/${item.id}`}>View Hotel</Link>
            </Button>
          )}
          {item.type === 'restaurant' && (
            <Button
              asChild
              size='sm'
              className='flex-1'
            >
              <Link href={`/restaurants/${item.id}`}>View Restaurant</Link>
            </Button>
          )}
          {item.type === 'attraction' && (
            <Button
              asChild
              size='sm'
              className='flex-1'
            >
              <Link href={`/attractions/${item.id}`}>View Attraction</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    linkText,
    linkHref,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
  }) => (
    <Card>
      <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
        <Icon className='mb-4 h-12 w-12 text-muted-foreground' />
        <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
        <p className='mb-4 text-muted-foreground'>{description}</p>
        <Button asChild>
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>My Wishlist</h1>
        <p className='text-muted-foreground'>
          Places and experiences you want to remember
        </p>
      </div>

      {error && (
        <Alert
          variant='destructive'
          className='mb-6'
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue={'all'}
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger
            value='all'
            className='flex items-center'
          >
            <Bookmark className='mr-2 h-4 w-4' />
            All ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger
            value='destinations'
            className='flex items-center'
          >
            <CompassIcon className='mr-2 h-4 w-4' />
            Destinations ({destinations.length})
          </TabsTrigger>
          <TabsTrigger
            value='hotels'
            className='flex items-center'
          >
            <Hotel className='mr-2 h-4 w-4' />
            Hotels ({hotels.length})
          </TabsTrigger>
          <TabsTrigger
            value='restaurants'
            className='flex items-center'
          >
            <UtensilsCrossed className='mr-2 h-4 w-4' />
            Restaurants ({restaurants.length})
          </TabsTrigger>
          <TabsTrigger
            value='attractions'
            className='flex items-center'
          >
            <MapPin className='mr-2 h-4 w-4' />
            Attractions ({attractions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all'>
          {wishlistItems.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {wishlistItems.map(renderWishlistCard)}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title='Your wishlist is empty'
              description="Save places you'd like to visit and experiences to remember"
              linkText='Discover Places'
              linkHref='/destinations'
            />
          )}
        </TabsContent>

        <TabsContent value='destinations'>
          {destinations.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {destinations.map(renderWishlistCard)}
            </div>
          ) : (
            <EmptyState
              icon={CompassIcon}
              title='No destinations saved'
              description="Save destinations you'd like to visit"
              linkText='Explore Destinations'
              linkHref='/destinations'
            />
          )}
        </TabsContent>

        <TabsContent value='hotels'>
          {hotels.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {hotels.map(renderWishlistCard)}
            </div>
          ) : (
            <EmptyState
              icon={Hotel}
              title='No hotels saved'
              description="Save hotels you're interested in"
              linkText='Browse Hotels'
              linkHref='/destinations'
            />
          )}
        </TabsContent>

        <TabsContent value='restaurants'>
          {restaurants.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {restaurants.map(renderWishlistCard)}
            </div>
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title='No restaurants saved'
              description='Save restaurants you want to try'
              linkText='Discover Restaurants'
              linkHref='/destinations'
            />
          )}
        </TabsContent>

        <TabsContent value='attractions'>
          {attractions.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {attractions.map(renderWishlistCard)}
            </div>
          ) : (
            <EmptyState
              icon={MapPin}
              title='No attractions saved'
              description='Save attractions you want to visit'
              linkText='Find Attractions'
              linkHref='/destinations'
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
