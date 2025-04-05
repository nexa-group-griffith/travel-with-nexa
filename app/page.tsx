'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation after component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-800 dark:via-black dark:to-purple-900 p-4'>
      <Card
        className={`max-w-xl w-full text-center shadow-xl p-8 rounded-2xl bg-white transform transition-all duration-500 ease-in-out dark:bg-gray-800 dark:text-white ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <CardContent>
          <div className='flex justify-center mb-4'>
            <Sparkles className='w-12 h-12 text-purple-600 animate-pulse dark:text-purple-400' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-2'>
            Welcome to{' '}
            <span className='text-purple-600 dark:text-purple-400'>
              Travel with Nexa
            </span>
          </h1>
          <p className='text-gray-600 text-lg mb-6 dark:text-gray-300'>
            Your adventure begins here. Explore destinations, plan trips, and
            travel smart with Nexa.
          </p>
          <Button className='text-lg px-6 py-2 dark:bg-purple-600 dark:hover:bg-purple-500 dark:text-white'>
            Get Started
          </Button>
          <div className='mt-6'>
            <h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>
              Why Choose Nexa?
            </h2>
            <ul className='list-disc list-inside text-gray-600 dark:text-gray-400'>
              <li className='mb-2'>📍 Discover stunning travel destinations</li>
              <li className='mb-2'>📅 Plan your perfect trips with ease</li>
              <li className='mb-2'>
                💡 Travel smarter with intelligent recommendations
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
