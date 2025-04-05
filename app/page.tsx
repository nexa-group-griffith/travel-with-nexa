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
    <main className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4'>
      <Card
        className={`max-w-xl w-full text-center shadow-xl p-8 rounded-2xl bg-white transform transition-all duration-500 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <CardContent>
          <div className='flex justify-center mb-4'>
            <Sparkles className='w-12 h-12 text-purple-600 animate-pulse' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Welcome to <span className='text-purple-600'>Travel with Nexa</span>
          </h1>
          <p className='text-gray-600 text-lg mb-6'>
            Your adventure begins here. Explore destinations, plan trips, and
            travel smart with Nexa.
          </p>
          <Button className='text-lg px-6 py-2'>Get Started</Button>
          <div className='mt-6'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
              Why Choose Nexa?
            </h2>
            <ul className='list-disc list-inside text-gray-600'>
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
