'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Calendar, Users } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PlaceResult, PlaceSearch } from '@/components/place-search';
import { handleCreateTripFunction } from './planTripFunctions';

export default function PlanTripPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [destination, setDestination] = useState<PlaceResult | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState('medium');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to plan a trip',
        variant: 'destructive',
      });
      router.push('/login?redirect=/plan-trip');
    }
  }, [user, authLoading, router, toast]);

  const handleCreateTrip = async () => {
    if (!user) {
      setError('Please log in to plan a trip');
      toast({
        title: 'Please log in to plan a trip',
        variant: 'destructive',
      });
      return;
    }
    if (!destination || !dateRange.from || !dateRange.to) {
      setError('Please select a destination and travel dates');
      toast({
        title: 'Please select a destination and travel dates',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    const tripId = await handleCreateTripFunction({
      destination,
      days:
        (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24),
      travelers,
      budget,
      interests,
      setLoading,
      setError,
      dateRange,
      user,
    });
    if (tripId) {
      router.push(`/destinations/${tripId}`);
    }
  };

  if (authLoading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Plan Your Trip</h1>
        <p className='text-muted-foreground'>
          Create a personalized travel itinerary
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

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>
              Enter the basic information for your trip
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='destination'>Destination</Label>
              <PlaceSearch
                onPlaceSelect={(place) => {
                  setDestination(place);
                }}
              />
            </div>

            <div className='space-y-2'>
              <Label>Travel Dates</Label>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='travelers'>Number of Travelers</Label>
              <div className='flex items-center'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  disabled={travelers <= 1}
                >
                  -
                </Button>
                <Input
                  id='travelers'
                  type='number'
                  min='1'
                  value={travelers}
                  onChange={(e) =>
                    setTravelers(Number.parseInt(e.target.value) || 1)
                  }
                  className='mx-2 w-20 text-center'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => setTravelers(travelers + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your travel experience</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Budget</Label>
              <Tabs
                defaultValue='medium'
                onValueChange={(value) => setBudget(value)}
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='budget'>Budget</TabsTrigger>
                  <TabsTrigger value='medium'>Medium</TabsTrigger>
                  <TabsTrigger value='luxury'>Luxury</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className='space-y-2'>
              <Label>Interests</Label>
              <div className='flex flex-wrap gap-2'>
                {[
                  'Culture',
                  'Food',
                  'Nature',
                  'Adventure',
                  'Relaxation',
                  'Shopping',
                  'History',
                  'Nightlife',
                ].map((interest) => (
                  <Button
                    key={interest}
                    type='button'
                    variant={
                      interests.includes(interest) ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() => {
                      if (interests.includes(interest)) {
                        setInterests(interests.filter((i) => i !== interest));
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTrip}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Trip'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className='mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
            <CardDescription>Preview of your planned trip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {destination ? (
                <div className='flex items-center'>
                  <MapPin className='mr-2 h-5 w-5 text-primary' />
                  <span className='font-medium'>{destination.name}</span>
                </div>
              ) : (
                <div className='text-muted-foreground'>
                  Select a destination
                </div>
              )}

              {dateRange.from && dateRange.to ? (
                <div className='flex items-center'>
                  <Calendar className='mr-2 h-5 w-5 text-primary' />
                  <span className='font-medium'>
                    {dateRange.from.toLocaleDateString()} -{' '}
                    {dateRange.to.toLocaleDateString()}(
                    {Math.ceil(
                      (dateRange.to.getTime() - dateRange.from.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days)
                  </span>
                </div>
              ) : (
                <div className='text-muted-foreground'>Select travel dates</div>
              )}

              <div className='flex items-center'>
                <Users className='mr-2 h-5 w-5 text-primary' />
                <span className='font-medium'>
                  {travelers} traveler{travelers !== 1 ? 's' : ''}
                </span>
              </div>

              {interests.length > 0 && (
                <div>
                  <span className='font-medium'>Interests: </span>
                  <span>{interests.join(', ')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
