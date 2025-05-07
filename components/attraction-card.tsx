'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ExternalLink, Clock, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AttractionResponse } from '@/datamodels/attractionsmodel';
import { useEffect, useState } from 'react';
import { getPlacePhotos } from '@/lib/get-travel-adviser-data';

export function AttractionCard({ activity }: { activity: AttractionResponse }) {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleGetPhotos = async () => {
    const res = await getPlacePhotos(activity?.location_id ?? '');
    const data = res.map(
      (item: any) => item?.images?.original?.url ?? '/placeholder.webp'
    );
    setPhotos(data);
  };

  useEffect(() => {
    setTimeout(() => {
      handleGetPhotos();
    }, 1000);
  }, [activity]);

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105'>
      <div className='relative h-48 w-full'>
        <Image
          src={photos[0] ?? '/placeholder.webp'}
          alt={activity?.name ?? 'Attraction'}
          fill
          className='object-cover'
        />
      </div>
      <CardContent className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{activity?.name}</h3>
        <div className='flex items-center text-sm text-muted-foreground mb-2'>
          <MapPin className='mr-2 h-4 w-4' />
          {activity?.address}, {activity?.address_obj?.city},{' '}
          {activity?.address_obj?.country}
        </div>
        <div className='text-sm text-muted-foreground mb-2'>
          <span className='font-medium'>Category:</span>{' '}
          {activity?.category?.name}
        </div>
        <div className='text-sm text-muted-foreground mb-2'>
          <span className='font-medium'>Distance:</span>{' '}
          {activity?.distance_string}
        </div>
        <div className='flex items-center text-sm text-muted-foreground mb-2'>
          <Phone className='mr-2 h-4 w-4' />
          {activity?.phone || 'N/A'}
        </div>
      </CardContent>
      <CardFooter className='flex gap-2 border-t bg-muted/50 p-4'>
        <Button
          asChild
          className='w-full'
        >
          <Link
            href={activity?.web_url}
            target='_blank'
          >
            View on TripAdvisor
          </Link>
        </Button>
        <Button
          variant='outline'
          className='w-full'
        >
          <ExternalLink className='h-3 w-3 mr-1' />
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${activity.name}, ${activity.address_obj.city}`
            )}`}
            target='_blank'
          >
            View on Map
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
