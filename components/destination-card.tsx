'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/lib/use-auth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';
import { TopDestination } from '@/lib/modes';
import { RatingComponent } from './rating';

interface DestinationCardProps {
  destination: TopDestination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save destinations to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const wishlist = docSnap.data().wishlist || [];

        const updatedWishlist = wishlist.filter(
          (item: { id: string }) => item.id !== destination.id
        );

        if (updatedWishlist.length < wishlist.length) {
          await updateDoc(userRef, { wishlist: updatedWishlist });
          setIsSaved(false);
          toast({
            title: 'Removed from wishlist',
            description: `${destination.name} has been removed from your wishlist`,
          });
        } else {
          await updateDoc(userRef, {
            wishlist: [
              ...wishlist,
              {
                id: destination.id,
                name: destination?.name,
                country: destination?.country,
                image: destination?.imageUrl,
                description: destination?.description,
              },
            ],
          });
          setIsSaved(true);
          toast({
            title: 'Added to wishlist',
            description: `${destination.name} has been added to your wishlist`,
          });
        }
      } else {
        await setDoc(userRef, {
          userId: user.uid,
          wishlist: [
            {
              id: destination.id,
              name: destination.name,
              country: destination.country,
              image: destination?.imageUrl,
              description: destination.description,
            },
          ],
        });
        setIsSaved(true);
        toast({
          title: 'Added to wishlist',
          description: `${destination.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    const searchQuery = `${destination.name}, ${destination.country}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchQuery
      )}`,
      '_blank'
    );
  };

  return (
    <Card className='overflow-hidden  hover:shadow-md transition-shadow duration-200 hover:scale-105  transition-transform '>
      <div className='relative'>
        <div className='relative h-48 w-full overflow-hidden'>
          <Image
            src={destination?.imageUrl || '/placeholder.webp'}
            alt={destination?.name ?? 'Destination'}
            fill
            className='object-cover transition-transform duration-300 hover:scale-105'
          />
        </div>
        {/* <Button
          size='icon'
          variant='secondary'
          className='absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background z-10'
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
          disabled={isLoading}
        >
          <Heart
            className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`}
          />
        </Button> */}
      </div>
      <CardHeader>
        <CardTitle className='flex items-center text-lg'>
          <MapPin className='mr-2 h-5 w-5' /> {destination?.name},{' '}
          {destination?.country}
        </CardTitle>
        <div className='flex items-center gap-1'>
          <RatingComponent rating={destination?.rating ?? 0} />
          <span className='ml-2'>{destination?.rating ?? 0}/5</span>
        </div>
        <CardDescription className='flex items-center gap-1'>
          <FaMoneyBillWaveAlt />
          {destination?.budget}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
          {destination?.description}
        </p>
        <div className='mb-3 flex flex-wrap gap-1'>
          {destination?.tags?.map((tag, index) => (
            <Badge
              key={index}
              variant='secondary'
              className='text-xs'
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className='border-t bg-muted/50 p-4'>
        <div className='flex w-full gap-2'>
          <Button
            asChild
            className='flex-1'
          >
            <Link href={`/destinations/${destination?.id}`}>Explore</Link>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='flex-shrink-0'
            onClick={(e) => {
              e.stopPropagation();
              openInGoogleMaps();
            }}
          >
            <ExternalLink className='h-4 w-4' />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
