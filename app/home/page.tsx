'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
// import { PopularDestinations } from '@/components/popular-destinations';
import { useAuth } from '@/lib/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PopularDestinations } from '@/components/popular-destinations';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/home');
    }
  }, [user, router]);

  return (
    <div className='container mx-auto px-4'>
      <HeroSection />
      <FeaturesSection />

      <PopularDestinations />
      <section className='py-16 text-center'>
        <h2 className='mb-6 text-3xl font-bold'>
          Ready to Start Your Journey?
        </h2>
        <p className='mb-8 text-lg text-muted-foreground'>
          Create an account to save your favorite destinations, get personalized
          recommendations, and more.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Button
            asChild
            size='lg'
            className='w-full sm:w-auto'
          >
            <Link href='/signup'>Sign Up Now</Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='w-full sm:w-auto'
          >
            <Link href='/login'>Log In</Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='secondary'
            className='w-full sm:w-auto'
          >
            <Link href='/login?redirect=/plan-trip'>Let's Start Planning</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
