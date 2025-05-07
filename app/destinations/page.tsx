'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Loader, MapIcon, Loader2 } from 'lucide-react';
import { getPopularPlaces } from '../../lib/generate-popular-places';
import {
  addTopDestinationsToLocalStorage,
  getTopDestinationsFromLocalStorage,
} from '@/lib/localstorage';
import { DestinationCard } from '@/components/destination-card';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDestinations, setTopDestinations] = useState<any[]>([]);

  const filteredDestinations = () => {
    return topDestinations.filter((destination) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        destination.name.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query) ||
        destination.description.toLowerCase().includes(query) ||
        destination.tags.some((tag: string) =>
          tag.toLowerCase().includes(query)
        )
      );
    });
  };

  const getPopular = async () => {
    const parsedData = getTopDestinationsFromLocalStorage();

    if (parsedData) {
      try {
        if (Array.isArray(parsedData)) {
          setDestinations(parsedData);
          setTopDestinations(parsedData);
          setLoading(false);
          console.log('Loaded from localStorage:', parsedData);
          return;
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }

    try {
      const res = await getPopularPlaces();
      if (res) {
        const sortedData = res.sort((a: any, b: any) => b.rating - a.rating);
        addTopDestinationsToLocalStorage(sortedData);
        setDestinations(sortedData);
        setTopDestinations(sortedData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPopular();
  }, []);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setDestinations(topDestinations);
    } else {
      setDestinations(
        filteredDestinations().sort((a, b) => b.rating - a.rating)
      );
    }
  }, [searchQuery, topDestinations]);

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Explore Destinations</h1>
        <p className='text-muted-foreground'>
          Discover amazing places around the world
        </p>
      </div>

      <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search destinations, countries, places or place types...'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>Search</Button>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {destinations?.map((destination, index) => (
          <DestinationCard
            key={index}
            destination={destination}
          />
        ))}
      </div>

      {/* {destinations.length > 0 && (
        <Card className='mt-6 md:col-span-1'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2'>
              <MapIcon className='h-5 w-5' />
              Map for Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-[400px]'>
              <div className='text-sm text-muted-foreground w-full h-[400px]'>
                <MapView
                  locations={
                    destinations?.map((attraction: any) => ({
                      name: attraction?.restaurantName ?? 'dublin',
                      lat: attraction?.geoCoordinates?.latitude ?? 0,
                      lon: attraction?.geoCoordinates?.longitude ?? 0,
                    })) ?? []
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {loading ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='text-muted-foreground'>Loading destinations...</p>
          </CardContent>
        </Card>
      ) : destinations?.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
            <MapPin className='mb-4 h-12 w-12 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>
              No destinations found
            </h3>
            <p className='text-muted-foreground'>
              Try adjusting your search or filters to find what you're looking
              for
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
