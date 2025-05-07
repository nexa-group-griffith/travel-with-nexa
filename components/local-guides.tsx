'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { User, Globe, Phone, Briefcase, MapPin, Map } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface Guide {
  name: string;
  type: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone: string;
  'official website'?: string;
  officialwebsite?: string;
}

interface LocalGuidesProps {
  guides: Guide[];
  destinationName: string;
}

export default function LocalGuides({
  guides,
  destinationName,
}: LocalGuidesProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Travel Agent':
        return <Briefcase className='h-6 w-6 text-blue-500' />;
      case 'Tour Guide':
        return <MapPin className='h-6 w-6 text-green-500' />;
      default:
        return <User className='h-6 w-6 text-gray-500' />;
    }
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  return (
    <Card className='p-6 shadow-xl rounded-lg'>
      <CardHeader className='pb-4 border-b border-gray-300 dark:border-gray-700'>
        <CardTitle className='flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
          <User className='h-7 w-7 text-primary' />
          Local Guides
        </CardTitle>
        <CardDescription className='text-muted-foreground text-sm dark:text-gray-400'>
          Expert local guides to enhance your experience in {destinationName}
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-4'>
        {loading ? (
          <div className='space-y-3'>
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-[90%]' />
            <Skeleton className='h-5 w-[95%]' />
            <Skeleton className='h-5 w-[85%]' />
            <Skeleton className='h-5 w-[90%]' />
          </div>
        ) : guides.length === 0 ? (
          <div className='text-center text-gray-500 dark:text-gray-400 text-lg'>
            No local guides found for {destinationName}. Please check back
            later!
          </div>
        ) : (
          <div className='grid gap-6'>
            {guides?.map((guide, index) => (
              <div
                key={index}
                className='p-5 border rounded-xl shadow-lg hover:shadow-xl transition-all bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              >
                <div className='flex items-center gap-3 mb-2'>
                  {getTypeIcon(guide?.type)}
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {guide?.name}
                  </h3>
                </div>
                <p className='text-sm text-muted-foreground mb-3 dark:text-gray-300'>
                  {guide?.description}
                </p>
                <div className='text-sm flex items-center gap-2 mb-2'>
                  <Map className='h-4 w-4 text-green-500' /> {guide?.address}
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <a
                    href={'#'}
                    className='flex items-center gap-1 text-blue-600 hover:underline font-medium dark:text-blue-400'
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        guide?.officialwebsite ??
                          guide?.website ??
                          guide['official website'] ??
                          '',
                        '_blank'
                      );
                    }}
                  >
                    <Globe className='h-4 w-4' /> Visit Website
                  </a>

                  <span className='flex items-center gap-1 text-gray-700 font-medium dark:text-gray-200'>
                    <Phone className='h-4 w-4' /> {guide?.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
