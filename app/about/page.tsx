'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Users,
  Shield,
  Compass,
  Award,
  MessageSquare,
  Globe,
  Cloud,
  Server,
} from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AboutLoading from './loading';

export default function AboutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <AboutLoading />;
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <section className='mb-16 text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight sm:text-5xl'>
          About Nexa Group
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Your ultimate travel companion, helping you discover new destinations
          and travel with confidence.
        </p>
      </section>

      <section className='mb-16 grid gap-8 md:grid-cols-2 md:items-center'>
        <div>
          <h2 className='mb-4 text-3xl font-bold'>Our Story</h2>
          <p className='mb-4 text-muted-foreground'>
            Nexa Group was founded with a vision to revolutionize the way people
            travel. We believe that travel should be an exciting and enriching
            experience, not a chore.
          </p>
          <p className='mb-4 text-muted-foreground'>
            Our team of travel enthusiasts and technology experts came together
            to create a platform that combines local knowledge, real-time data,
            and personalized recommendations to help travelers make the most of
            their journeys.
          </p>
          <p className='text-muted-foreground'>
            Whether you're a seasoned globetrotter or planning your first
            international trip, TravelBuddy is designed to be your trusted
            companion every step of the way.
          </p>
        </div>
        <div className='relative h-[600px] overflow-hidden rounded-lg shadow-xl'>
          <Image
            src='/favicon.ico'
            alt='Travel planning'
            fill
            className='object-cover'
          />
        </div>
      </section>

      <section className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>
          Our Mission & Values
        </h2>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <Compass className='mb-2 h-8 w-8 text-primary' />
              <CardTitle>Discover</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                We help travelers discover hidden gems and authentic experiences
                that go beyond typical tourist attractions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className='mb-2 h-8 w-8 text-primary' />
              <CardTitle>Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                We prioritize traveler safety by providing real-time alerts,
                fraud warnings, and essential local information.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className='mb-2 h-8 w-8 text-primary' />
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                We foster a global community of travelers who share insights,
                tips, and experiences with each other.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>Meet Our Team</h2>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {[
            {
              name: 'Devendra Pandhigunta',
              image: 'dev.jpg?height=400&width=400',
            },
            {
              name: 'Siddharth Pampana',
              image: 'sid.jpeg?height=330&width=330',
            },
            {
              name: 'Olokunola Hassan Taiwo',
              image: 'hassan.jpeg?height=400&width=400',
            },
            {
              name: 'Rithal Niranjan Oswal',
              image: 'rishika.jpeg?height=400&width=400',
            },
            {
              name: 'Gopi Naga Seetha Kumari Paruchuri',
              image: 'seetha.jpeg?height=400&width=400',
            },
            {
              name: 'Sadhvika Padmasetti',
              image: 'sadhvika.jpeg?height=200&width=400',
            },
            {
              name: 'Osemwonken Godswill Osakue',
              image: 'Osemwonken Godswill Osakue.jpg?height=400&width=400',
            },
            {
              name: 'Ece Naz Olmez',
              image: 'Aj.jpeg?height=400&width=400',
            },
            {
              name: 'Olokunola Hussein Kehinde',
              image: 'Hussein Kehinde Olokunola.jpg?height=400&width=400',
            },
            {
              name: 'Ayooluwa Oyebowale',
              image: '/placeholder.webp?height=400&width=400',
            },
          ].map((member, index) => (
            <div
              key={index}
              className='text-center transition-all duration-300 transform hover:scale-105'
            >
              <div className='mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full'>
                <Image
                  src={member.image || ''}
                  alt={member.name}
                  width={160}
                  height={160}
                  className='h-full w-full object-cover object-top'
                />
              </div>
              <h3 className='mb-1 text-xl font-semibold'>{member.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>
          What Makes Us Different
        </h2>
        <Tabs
          defaultValue='planning'
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='planning'>Trip Planning</TabsTrigger>
            <TabsTrigger value='safety'>Safety Features</TabsTrigger>
            <TabsTrigger value='local'>Local Insights</TabsTrigger>
          </TabsList>
          <TabsContent
            value='planning'
            className='mt-6'
          >
            <Card>
              <CardHeader>
                <CardTitle>Intelligent Trip Planning</CardTitle>
                <CardDescription>
                  Create personalized itineraries based on your preferences,
                  budget, and time constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-6 md:grid-cols-2'>
                <div className='flex items-start gap-4'>
                  <Award className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>AI-Powered Recommendations</h4>
                    <p className='text-sm text-muted-foreground'>
                      Our AI analyzes thousands of reviews and travel patterns
                      to suggest the perfect destinations for you.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <MapPin className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>Interactive Maps</h4>
                    <p className='text-sm text-muted-foreground'>
                      Visualize your entire trip with interactive maps showing
                      attractions, restaurants, and accommodations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value='safety'
            className='mt-6'
          >
            <Card>
              <CardHeader>
                <CardTitle>Travel With Confidence</CardTitle>
                <CardDescription>
                  Stay informed about safety concerns and travel advisories
                  wherever you go.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-6 md:grid-cols-2'>
                <div className='flex items-start gap-4'>
                  <Shield className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>Real-time Alerts</h4>
                    <p className='text-sm text-muted-foreground'>
                      Receive instant notifications about safety issues, weather
                      events, or travel disruptions.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <Users className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>Community Verification</h4>
                    <p className='text-sm text-muted-foreground'>
                      Benefit from our community of travelers who verify and
                      update safety information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value='local'
            className='mt-6'
          >
            <Card>
              <CardHeader>
                <CardTitle>Experience Like a Local</CardTitle>
                <CardDescription>
                  Discover authentic experiences and hidden gems recommended by
                  locals.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-6 md:grid-cols-2'>
                <div className='flex items-start gap-4'>
                  <Compass className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>Local Guides</h4>
                    <p className='text-sm text-muted-foreground'>
                      Access tips and recommendations from residents who know
                      their cities best.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <MessageSquare className='mt-1 h-5 w-5 text-primary' />
                  <div>
                    <h4 className='font-medium'>Cultural Insights</h4>
                    <p className='text-sm text-muted-foreground'>
                      Learn about local customs, etiquette, and cultural nuances
                      before you arrive.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {!user ? (
        <section className='rounded-lg bg-primary/10 p-8 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>
            Ready to Start Your Journey?
          </h2>
          <p className='mx-auto mb-6 max-w-2xl text-muted-foreground'>
            Join thousands of travelers who use TravelBuddy to discover new
            destinations, plan unforgettable trips, and travel with confidence.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button
              asChild
              size='lg'
            >
              <Link href='/signup'>Sign Up Now</Link>
            </Button>

            <Button
              asChild
              variant='outline'
              size='lg'
            >
              <Link href='/destinations'>Explore Destinations</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>
          Technologies We Use
        </h2>
        <div className='grid gap-8 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <div className='mb-2 flex items-center'>
                <div className='mr-2 rounded-full bg-primary/10 p-2'>
                  <Compass className='h-6 w-6 text-primary' />
                </div>
                <CardTitle>Frontend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Next.js</span>
                    <p className='text-xs text-muted-foreground'>
                      React framework for production
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' />
                      <line
                        x1='16'
                        y1='8'
                        x2='2'
                        y2='22'
                      />
                      <line
                        x1='17.5'
                        y1='15'
                        x2='9'
                        y2='15'
                      />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Tailwind CSS</span>
                    <p className='text-xs text-muted-foreground'>
                      Utility-first CSS framework
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
                      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
                      <line
                        x1='12'
                        y1='22.08'
                        x2='12'
                        y2='12'
                      />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>TypeScript</span>
                    <p className='text-xs text-muted-foreground'>
                      Typed JavaScript for better development
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <circle
                        cx='12'
                        cy='12'
                        r='10'
                      />
                      <circle
                        cx='12'
                        cy='12'
                        r='4'
                      />
                      <line
                        x1='4.93'
                        y1='4.93'
                        x2='9.17'
                        y2='9.17'
                      />
                      <line
                        x1='14.83'
                        y1='14.83'
                        x2='19.07'
                        y2='19.07'
                      />
                      <line
                        x1='14.83'
                        y1='9.17'
                        x2='19.07'
                        y2='4.93'
                      />
                      <line
                        x1='14.83'
                        y1='9.17'
                        x2='18.36'
                        y2='5.64'
                      />
                      <line
                        x1='4.93'
                        y1='19.07'
                        x2='9.17'
                        y2='14.83'
                      />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>React</span>
                    <p className='text-xs text-muted-foreground'>
                      UI library for building interfaces
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='mb-2 flex items-center'>
                <div className='mr-2 rounded-full bg-primary/10 p-2'>
                  <Server className='h-6 w-6 text-primary' />
                </div>
                <CardTitle>Backend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Firebase</span>
                    <p className='text-xs text-muted-foreground'>
                      Authentication & database
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                      <circle
                        cx='12'
                        cy='7'
                        r='4'
                      />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Firebase Auth</span>
                    <p className='text-xs text-muted-foreground'>
                      User authentication system
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Firestore</span>
                    <p className='text-xs text-muted-foreground'>
                      NoSQL cloud database
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-700 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <rect
                        x='2'
                        y='2'
                        width='20'
                        height='20'
                        rx='5'
                        ry='5'
                      />
                      <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                      <line
                        x1='17.5'
                        y1='6.5'
                        x2='17.51'
                        y2='6.5'
                      />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Firebase Storage</span>
                    <p className='text-xs text-muted-foreground'>
                      Cloud storage for files
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='mb-2 flex items-center'>
                <div className='mr-2 rounded-full bg-primary/10 p-2'>
                  <Globe className='h-6 w-6 text-primary' />
                </div>
                <CardTitle>APIs & Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-400 text-white'>
                    <MapPin className='h-5 w-5' />
                  </div>
                  <div>
                    <span className='font-medium'>Google Maps API</span>
                    <p className='text-xs text-muted-foreground'>
                      Maps & location services
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-blue-300 text-white'>
                    <Cloud className='h-5 w-5' />
                  </div>
                  <div>
                    <span className='font-medium'>OpenWeather API</span>
                    <p className='text-xs text-muted-foreground'>
                      Weather data & forecasts
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <path d='M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Google Places API</span>
                    <p className='text-xs text-muted-foreground'>
                      Location data & search
                    </p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      height='20'
                      width='20'
                      fill='none'
                      stroke='currentColor'
                    >
                      <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
                    </svg>
                  </div>
                  <div>
                    <span className='font-medium'>Vercel</span>
                    <p className='text-xs text-muted-foreground'>
                      Deployment & hosting platform
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
