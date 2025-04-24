'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Plus, Loader2, Sun } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import WeatherDashboard from '@/components/weather-detail';
import { tripsService } from '@/lib/trips-service';
import { wishlistService } from '@/lib/wishlist-service';
import { authService } from '@/lib/auth-service';
import type { Trip } from '@/types/trips';
import type { WishlistItem } from '@/types/wishlist';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(userData);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch trips
        const tripsResponse = await tripsService.getAllTrips();
        if (tripsResponse.success) {
          setTrips(tripsResponse.trips);
        } else {
          toast({
            title: 'Error fetching trips',
            description: tripsResponse.message,
            variant: 'destructive',
          });
        }

        // Fetch wishlist
        const wishlistResponse = await wishlistService.getWishlist();
        if (wishlistResponse.success) {
          setWishlist(wishlistResponse.items ?? []);
        } else {
          toast({
            title: 'Error fetching wishlist',
            description: wishlistResponse.message,
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, toast]);

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
        <h1 className='text-3xl font-bold'>
          Welcome back, {user?.displayName || 'Traveler'}!
        </h1>
        <p className='text-muted-foreground'>
          Manage your trips and discover new destinations
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

      <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
        <Button
          asChild
          className='flex-1'
        >
          <Link href='/plan-trip'>
            <Plus className='mr-2 h-4 w-4' />
            Plan a New Trip
          </Link>
        </Button>
        <Button
          asChild
          variant='outline'
          className='flex-1'
        >
          <Link href='/destinations'>
            <MapPin className='mr-2 h-4 w-4' />
            Explore Destinations
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue='upcoming'
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='upcoming'>Trips</TabsTrigger>
          <TabsTrigger value='wishlist'>Wishlist</TabsTrigger>
          <TabsTrigger value='weather'>Weather Updates</TabsTrigger>
        </TabsList>

        <TabsContent value='upcoming'>
          <Card>
            <CardHeader>
              <CardTitle>Your Trips</CardTitle>
              <CardDescription>Trips you have planned</CardDescription>
            </CardHeader>
            <CardContent>
              {trips?.length > 0 ? (
                <div className='space-y-6 min-h-[300px]'>
                  {trips?.map((trip) => (
                    <Card
                      key={trip.id}
                      className='overflow-hidden'
                    >
                      <div className='flex flex-col sm:flex-row'>
                        <div className='p-4 sm:w-2/3'>
                          <h3 className='text-xl font-semibold'>
                            Trip to {trip.destination.name}
                          </h3>
                          <div className='mb-2 flex items-center text-sm text-muted-foreground'>
                            <Calendar className='mr-2 h-4 w-4' />
                            {new Date(
                              trip.dates.start
                            ).toLocaleDateString()} -{' '}
                            {new Date(trip.dates.end).toLocaleDateString()} (
                            {trip.dates.days} days)
                          </div>
                          <p className='mb-4 text-sm text-muted-foreground'>
                            {trip.itinerary.overview}
                          </p>
                          <Button asChild>
                            <Link href={`/trips/${trip.id}`}>
                              View Trip Details
                            </Link>
                          </Button>
                        </div>
                        <div className='relative h-40 sm:h-auto sm:w-1/3'>
                          <Image
                            src={
                              trip.destination.photos?.[0] ||
                              '/placeholder.svg?height=200&width=300&query=travel'
                            }
                            alt={trip.destination.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center'>
                  <Calendar className='mb-4 h-12 w-12 text-muted-foreground' />
                  <h3 className='mb-2 text-lg font-semibold'>
                    No trips planned yet
                  </h3>
                  <p className='mb-4 text-muted-foreground'>
                    Start planning your next adventure
                  </p>
                  <Button asChild>
                    <Link href='/plan-trip'>Plan a Trip</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='wishlist'>
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Places you want to visit</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist?.length > 0 ? (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {wishlist.map((item) => (
                    <Card
                      key={item.id}
                      className='overflow-hidden hover:shadow-md transition-shadow'
                    >
                      <div className='relative h-48'>
                        <Image
                          src={
                            item.image ||
                            '/placeholder.svg?height=200&width=300&query=destination'
                          }
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold text-lg'>{item.name}</h3>
                        <p className='text-sm text-muted-foreground mb-2'>
                          {item.country}
                        </p>
                        <p className='text-sm line-clamp-2 mb-4'>
                          {item.description}
                        </p>
                        <div className='flex gap-2'>
                          <Button
                            asChild
                            variant='outline'
                            size='sm'
                            className='flex-1'
                          >
                            <Link href={`/destinations/${item.id}`}>
                              View Details
                            </Link>
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center'>
                  <MapPin className='mb-4 h-12 w-12 text-muted-foreground' />
                  <h3 className='mb-2 text-lg font-semibold'>
                    Your wishlist is empty
                  </h3>
                  <p className='mb-4 text-muted-foreground'>
                    Save places you'd like to visit
                  </p>
                  <Button asChild>
                    <Link href='/destinations'>Discover Places</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='weather'>
          <Card>
            <CardHeader>
              <CardTitle>Weather Updates</CardTitle>
              <CardDescription>
                Current weather at your destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherDashboard
                destination={{
                  name: 'Dublin',
                  lat: 53.338198,
                  lng: -6.26031,
                  timezone: 'Europe/Dublin',
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
