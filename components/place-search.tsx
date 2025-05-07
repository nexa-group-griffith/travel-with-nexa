'use client';

import { useState, useRef, useCallback } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTimezoneWithCoordinates } from '@/lib/weather-api';

interface PlaceSearchProps {
  onPlaceSelect?: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  apiKey?: string;
}

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  timezone: string;
  url?: string;
  photos?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
}

export function PlaceSearch({
  onPlaceSelect,
  placeholder = 'Search for a place...',
  className,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}: PlaceSearchProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (
        place.place_id &&
        place.geometry &&
        place.geometry.location &&
        onPlaceSelect
      ) {
        const place1 = await getTimezoneWithCoordinates(
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );

        const data: PlaceResult = {
          formatted_address: place?.formatted_address || '',
          place_id: place?.place_id || '',
          name: place?.name || '',
          timezone: place1 || '',
          url: place?.url || '',
          photos:
            place?.photos?.map((photo) => photo.getUrl({ maxWidth: 1000 })) ||
            [],
          geometry: {
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            viewport: {
              northeast: {
                lat: place?.geometry?.viewport?.getNorthEast()?.lat() || 0,
                lng: place?.geometry?.viewport?.getNorthEast()?.lng() || 0,
              },
              southwest: {
                lat: place?.geometry?.viewport?.getSouthWest()?.lat() || 0,
                lng: place?.geometry?.viewport?.getSouthWest()?.lng() || 0,
              },
            },
          },
        };
        onPlaceSelect(data);
      }
    }
  };

  return (
    <Autocomplete
      onLoad={onLoadAutocomplete}
      onPlaceChanged={onPlaceChanged}
      options={{
        types: ['(cities)'],
        fields: [
          'name',
          'geometry',
          'formatted_address',
          'place_id',
          'url',
          'photos',
        ],
      }}
    >
      <div className={cn('relative w-full', className)}>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <input
          type='text'
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label='Search for a place'
        />
      </div>
    </Autocomplete>
  );
}
