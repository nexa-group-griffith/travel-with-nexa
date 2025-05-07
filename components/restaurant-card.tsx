'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Utensils, DollarSign, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/lib/modes';
import { RestaurantResponse } from '@/datamodels/testraurantsmodel';

interface RestaurantCardProps {
  restaurant: RestaurantResponse;
  destination: string;
}

export function RestaurantCard({
  restaurant,
  destination,
}: RestaurantCardProps) {
  const openInGoogle = () => {
    const searchQuery = `${restaurant.name} ${destination} restaurant`;
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
            restaurant?.photo?.images?.original?.url ??
            '/placeholder.webp?height=200&width=400'
          }
          alt={restaurant?.name || 'Restaurant'}
          fill
          className='rounded-t-lg object-cover'
        />
      </div>
      <CardHeader>
        <CardTitle>{restaurant.name}</CardTitle>
        <CardDescription>{restaurant.name}</CardDescription>
        <div className='flex items-center'>
          <Star className='mr-1 h-4 w-4 fill-yellow-500 text-yellow-500' />
          <span>{restaurant.rating}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-4 text-muted-foreground'>{restaurant.description}</p>
        <div className='space-y-2'>
          <div className='flex items-center text-sm'>
            <Utensils className='mr-2 h-4 w-4 text-muted-foreground' />
          </div>
          <div className='flex items-center text-sm'>
            <DollarSign className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>{restaurant.price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex gap-2 border-t bg-muted/50 p-4'>
        <Button
          className='w-full'
          asChild
          onClick={(e) => {
            e.preventDefault();
            openInGoogle();
          }}
        >
          <span>View on Google</span>
        </Button>
        <Button
          variant='outline'
          className='w-full'
        >
          <ExternalLink className='h-3 w-3 mr-1' />
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${restaurant.name} ${destination}`
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
