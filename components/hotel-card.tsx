'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { HotelResponse } from '@/datamodels/hotelmodels';

interface HotelCardProps {
  hotel: HotelResponse;
  destination: string;
}

export function HotelCard({ hotel, destination }: HotelCardProps) {
  const openInGoogle = () => {
    const searchQuery = `${hotel.name} ${destination} hotel Booking`;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
      '_blank'
    );
  };

  return (
    <Card className='overflow-hidden cursor-pointer hover:shadow-md transition-shadow hover:scale-105'>
      <div className='relative h-48 w-full'>
        <Image
          src={
            hotel?.photo?.images?.large?.url ??
            `/placeholder.webp?height=300&width=500`
          }
          alt={hotel?.name || 'Hotel'}
          fill
          className='object-cover'
        />
      </div>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='font-semibold'>{hotel.name}</h3>
          <Badge variant={'default'}>{hotel.email}</Badge>
        </div>
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center'>
            <Star className='mr-1 h-4 w-4 fill-yellow-500 text-yellow-500' />
            <span>{hotel.rating}</span>
          </div>
          <div className='text-sm font-medium'>{hotel.price}</div>
        </div>
        <div className='mb-3 flex items-center text-sm text-muted-foreground'>
          <MapPin className='mr-1 h-3 w-3' />
          {hotel.address}
        </div>
        <p className='mb-3 text-sm text-muted-foreground'>
          {hotel.description}
        </p>
      </CardContent>
      <CardFooter className='flex gap-2 border-t bg-muted/50 p-4'>
        <Button
          className='w-full'
          onClick={(e) => {
            e.stopPropagation();
            openInGoogle();
          }}
        >
          <span>Book Now</span>
        </Button>
        <Button
          variant='outline'
          className='w-full'
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${hotel.address} ${destination}`
              )}`,
              '_blank'
            );
          }}
        >
          <ExternalLink className='h-3 w-3 mr-1' />
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${hotel.address} ${destination}`
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
