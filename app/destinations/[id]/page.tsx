'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Heart, MapIcon, Loader2 } from 'lucide-react';
import { SecurityAlerts } from '@/components/security-alerts';
import {
  generateAboutPlace,
  generateDestinationInfo,
} from '@/lib/generate-destination-info';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/use-auth';
import { marked } from 'marked';
import { AttractionCard } from '@/components/attraction-card';
import LocalGuides from '@/components/local-guides';
import { RatingComponent } from '@/components/rating';
import { getUserDataFromLocalStorage } from '@/lib/localstorage';
import WeatherDashboard from '@/components/weather-detail';
import MapView from '@/components/map-view';
import type { TripDetailsResponse } from '@/datamodels/tripmodels';
import { FraudAlerts } from '@/components/fraud-alerts';
import type { AttractionResponse } from '@/datamodels/attractionsmodel';
import Transportation from '@/components/transport';
import { HotelCard } from '@/components/hotel-card';
import { RestaurantCard } from '@/components/restaurant-card';
import type { HotelResponse } from '@/datamodels/hotelmodels';
import type { RestaurantResponse } from '@/datamodels/testraurantsmodel';
import WishlistButton from '@/components/wishlist-button';

export default function DestinationPage() {
  const { user } = useAuth();
  const localUserData = getUserDataFromLocalStorage();
  const router = useRouter();
  const params = useParams();
  const [destination, setDestination] = useState<TripDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [generatedInfo, setGeneratedInfo] = useState<string | null>(null);
  const [generatingInfo, setGeneratingInfo] = useState(false);
  const [displayedInfo, setDisplayedInfo] = useState<string>('');
  const [aboutPlace, setAboutPlace] = useState<string | null>(null);
  const [hasPlannedTrip, setHasPlannedTrip] = useState(false);

  const fetchDestination = async () => {
    if (!db) return;
    const tripsRef = collection(doc(db, 'users', localUserData.uid), 'trips');
    const querySnapshot = await getDocs(tripsRef);

    const trips: any[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const found: TripDetailsResponse =
      trips.find((trip) => trip.id === params.id) || null;
    console.log(found, 'found');
    if (found) {
      setDestination(found || null);
      setLoading(false);
      handleGenerateAboutPlace(
        found?.placesDetails?.formatted_address || found?.placesDetails?.name
      );
      setHasPlannedTrip(true);
    }
  };

  useEffect(() => {
    if (localUserData && !destination) {
      fetchDestination();
    } else if (!localUserData) {
      router.push('/login');
    }
  }, [params.id, localUserData, destination]);

  const handleGenerateInfo = async () => {
    if (!destination) return;

    setGeneratingInfo(true);
    try {
      const info = await generateDestinationInfo(
        `${destination.placesDetails.formatted_address}`
      );
      setGeneratedInfo(info);
      displayTextCharacterByCharacter(info);
    } catch (error) {
      console.error('Error generating information:', error);
    } finally {
      setGeneratingInfo(false);
    }
  };

  const handleGenerateAboutPlace = async (destination: string) => {
    if (!destination || aboutPlace) return;
    try {
      const info = await generateAboutPlace(`${destination}`);

      setAboutPlace(info);
    } catch (error) {
      console.error('Error generating information:', error);
    }
  };

  const displayTextCharacterByCharacter = (text: string) => {
    let index = 0;
    setDisplayedInfo('');

    const interval = setInterval(() => {
      setDisplayedInfo((prev) => prev + text[index]);
      index += 1;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 1);
  };

  if (loading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='ml-2 text-muted-foreground'>
          Planning your trip... This may take a few seconds.
        </p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className='container py-10'>
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <MapPin className='mb-4 h-16 w-16 text-muted-foreground' />
          <h1 className='mb-2 text-2xl font-bold'>Destination Not Found</h1>
          <p className='mb-6 text-muted-foreground'>
            We couldn't find the destination you're looking for.
          </p>
          <Button asChild>
            <a href='/destinations'>Browse All Destinations</a>
          </Button>
        </div>
      </div>
    );
  }
  const {
    placesDetails,
    hotels,
    restaurants,
    reviews,
    localGuides,
    attractions,
    currency,
    currencyCode,
    currencySymbol,
    fraudAlerts,
    securityAlerts,
    currencyExchangeRate,
  } = destination;

  return (
    <div className='container pb-16 pt-8'>
      <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='relative h-[300px] w-full overflow-hidden rounded-lg sm:h-[400px] lg:h-[500px]'>
            <Image
              src={placesDetails?.photos?.[5] ?? '/placeholder.webp'}
              alt={placesDetails?.name || 'Destination'}
              fill
              className='object-cover rounded-xl shadow-lg'
            />
          </div>
        </div>
        <div className='flex flex-col justify-between'>
          <div>
            <div className='mb-4'>
              <h1 className='text-3xl font-bold'>{}</h1>
              <div className='flex items-center text-muted-foreground'>
                <MapPin className='mr-1 h-4 w-4' />
                <span>{placesDetails?.formatted_address || ''} </span>
              </div>
            </div>
            <div className='mb-4 flex items-center gap-2'>
              <div className='flex items-center'>
                <Star className='mr-1 h-5 w-5 fill-yellow-500 text-yellow-500' />
                <span className='font-medium'>{destination?.rating}</span>
                <span className='ml-1 text-muted-foreground'> /5</span>
              </div>
              <WishlistButton
                itemId={params.id as string}
                itemType='destination'
                itemData={{
                  id: params.id as string,
                  name: placesDetails?.name || '',
                  country:
                    placesDetails?.formatted_address
                      ?.split(',')
                      .pop()
                      ?.trim() || '',
                  city:
                    placesDetails?.formatted_address?.split(',')[0]?.trim() ||
                    '',
                  image: placesDetails?.photos?.[0] || '/placeholder.webp',
                  description: destination?.overview || '',
                  coordinates: {
                    lat: placesDetails?.geometry?.location?.lat || 0,
                    lng: placesDetails?.geometry?.location?.lng || 0,
                  },
                  rating: destination?.rating || 0,
                }}
              />
            </div>
            <span className='text-muted-foreground'>Languages</span>
            <div className='mb-6 flex flex-wrap gap-2 mt-2'>
              {destination?.languages?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant='default'
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className='mb-6 flex flex-wrap gap-2'>
              <span className='text-muted-foreground'>Interests</span>
              {destination?.interests?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant='secondary'
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className='mb-6 text-muted-foreground'>
              {destination?.overview}
            </p>

            {aboutPlace ? (
              <div
                className='prose prose-lg prose-indigo prose-headings:font-display prose-headings:font-normal prose-headings:leading-tight prose-headings:tracking-tight dark:prose-invert'
                dangerouslySetInnerHTML={{
                  __html: aboutPlace || '',
                }}
              />
            ) : (
              <div className='prose prose-lg prose-indigo prose-headings:font-display prose-headings:font-normal prose-headings:leading-tight prose-headings:tracking-tight dark:prose-invert'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            )}
          </div>
        </div>
      </div>
      <Tabs
        defaultValue='overview'
        className='mt-8 w-full'
      >
        <TabsList className='mb-4 grid w-full grid-cols-2 md:grid-cols-8 sm:grid-cols-1'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='attractions'>Attractions</TabsTrigger>
          <TabsTrigger value='hotels'>Hotels</TabsTrigger>
          <TabsTrigger value='restaurants'>Restaurants</TabsTrigger>
          <TabsTrigger value='travel-info'>Travel Info</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          <TabsTrigger value='weather'>Weather</TabsTrigger>
          <TabsTrigger value='alerts'>Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card className='md:col-span-1'>
              <CardHeader>
                <CardTitle>
                  About {destination?.placesDetails?.name || ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedInfo ? (
                  <div className='mt-4 rounded-lg border p-4'>
                    <h3 className='mb-2 text-lg font-medium'>
                      AI-Generated Travel Guide
                    </h3>
                    <div
                      className='prose prose-lg prose-indigo prose-headings:font-display prose-headings:font-normal prose-headings:leading-tight prose-headings:tracking-tight dark:prose-invert'
                      dangerouslySetInnerHTML={{
                        __html: marked(displayedInfo),
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateInfo}
                    disabled={generatingInfo}
                    variant='outline'
                  >
                    {generatingInfo
                      ? 'Generating...'
                      : 'Generate AI Travel Guide'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className='space-y-6'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2'>
                    <MapIcon className='h-5 w-5' />
                    Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-full'>
                    <div className='text-sm text-muted-foreground w-full h-full'>
                      <MapView
                        places={[
                          {
                            name: placesDetails?.name,
                            lat: placesDetails?.geometry?.location?.lat ?? 0,
                            lng: placesDetails?.geometry?.location?.lng ?? 0,
                            photoUrl:
                              placesDetails?.photos?.[5] ?? '/placeholder.webp',
                          },
                        ]}
                        height='600px'
                      />
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {/* {destination.name} is located at coordinates:{' '}
                    {destination.location?.lat.toFixed(6)},{' '}
                    {destination.location?.lng.toFixed(6)} */}
                  </p>
                </CardContent>
              </Card>
              {securityAlerts && securityAlerts?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Safety Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SecurityAlerts slerts={securityAlerts} />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Currency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Currency:</span>
                      <span>
                        {currency ?? ''}
                        {currencySymbol ?? ''}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>Exchange Rate:</span>
                      <span>{currencyExchangeRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='attractions'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {attractions?.map(
              (attraction: AttractionResponse, index: number) => {
                if (
                  !attraction ||
                  !attraction?.address ||
                  !attraction?.latitude ||
                  !attraction?.longitude ||
                  !attraction?.name ||
                  !attraction?.location_id
                ) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className='relative'
                  >
                    <AttractionCard activity={attraction} />
                    <div className='absolute top-2 right-2'>
                      <WishlistButton
                        itemId={attraction.location_id}
                        itemType='attraction'
                        itemData={{
                          id: attraction.location_id,
                          name: attraction.name,
                          country:
                            attraction.address?.split(',').pop()?.trim() || '',
                          city: attraction.address?.split(',')[0]?.trim() || '',
                          image:
                            attraction.photo?.images?.large?.url ||
                            '/placeholder.webp',
                          description: attraction.description || '',
                          coordinates: {
                            lat:
                              typeof attraction.latitude === 'string'
                                ? Number.parseFloat(attraction.latitude)
                                : attraction.latitude || 0,
                            lng:
                              typeof attraction.longitude === 'string'
                                ? Number.parseFloat(attraction.longitude)
                                : attraction.longitude || 0,
                          },
                          rating: parseInt(attraction.rating || '4.5') || 0,
                          address: attraction.address,
                        }}
                        size='icon'
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <Card className='mt-6 md:col-span-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2'>
                <MapIcon className='h-5 w-5' />
                Map for Attractions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-[400px]'>
                <div className='text-sm text-muted-foreground w-full h-[400px]'>
                  <MapView
                    places={
                      attractions
                        ?.filter(
                          (attraction: AttractionResponse) =>
                            attraction &&
                            attraction.address &&
                            attraction.latitude &&
                            attraction.longitude &&
                            attraction.name &&
                            attraction.location_id
                        )
                        .map((attraction: AttractionResponse) => ({
                          name: attraction?.name ?? 'Dublin',
                          lat:
                            typeof attraction?.latitude === 'string'
                              ? Number.parseFloat(attraction.latitude)
                              : attraction.latitude ?? 0,
                          lng:
                            typeof attraction?.longitude === 'string'
                              ? Number.parseFloat(attraction.longitude)
                              : attraction.longitude ?? 0,
                          photoUrl:
                            attraction?.photo?.images?.large?.url ??
                            '/placeholder.webp',
                        })) ?? []
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        Hotels{' '}
        <TabsContent value='hotels'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {hotels
              ?.filter(
                (hotel: HotelResponse) =>
                  hotel &&
                  hotel.address &&
                  hotel.latitude &&
                  hotel.longitude &&
                  hotel.name &&
                  hotel.location_id
              )
              ?.map((hotel: HotelResponse, index: number) => (
                <div
                  key={index}
                  className='relative'
                >
                  <HotelCard
                    key={index}
                    hotel={hotel}
                    destination={destination?.placesDetails?.name}
                  />
                  <div className='absolute top-2 right-2'>
                    <WishlistButton
                      itemId={hotel?.location_id || ' '}
                      itemType='hotel'
                      itemData={{
                        id: hotel.location_id || '',
                        name: hotel?.name || '',
                        country: hotel.address?.split(',').pop()?.trim() || '',
                        city: hotel.address?.split(',')[0]?.trim() || '',
                        image:
                          hotel.photo?.images?.large?.url ||
                          '/placeholder.webp',
                        description: hotel.description || '',
                        coordinates: {
                          lat:
                            typeof hotel.latitude === 'string'
                              ? Number.parseFloat(hotel.latitude)
                              : hotel.latitude || 0,
                          lng:
                            typeof hotel.longitude === 'string'
                              ? Number.parseFloat(hotel.longitude)
                              : hotel.longitude || 0,
                        },
                        rating: parseInt(hotel.rating || '3') || 0,
                        address: hotel.address,
                        price: hotel.price || '',
                      }}
                      size='icon'
                    />
                  </div>
                </div>
              ))}
          </div>
          <Card className='mt-6 md:col-span-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2'>
                <MapIcon className='h-5 w-5' />
                Map for Hotels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-[400px]'>
                <div className='text-sm text-muted-foreground w-full h-[400px]'>
                  <MapView
                    places={
                      hotels
                        ?.filter(
                          (hotel: HotelResponse) =>
                            hotel &&
                            hotel.address &&
                            hotel.latitude &&
                            hotel.longitude &&
                            hotel.name &&
                            hotel.location_id
                        )
                        ?.map((attraction: HotelResponse) => ({
                          name: attraction?.name ?? 'dublin',
                          lat:
                            typeof attraction?.latitude === 'string'
                              ? Number.parseFloat(attraction.latitude)
                              : attraction.latitude ?? 0,
                          lng:
                            typeof attraction?.longitude === 'string'
                              ? Number.parseFloat(attraction.longitude)
                              : attraction.longitude ?? 0,
                          photoUrl:
                            attraction?.photo?.images?.large?.url ??
                            '/placeholder.webp',
                        })) ?? []
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='restaurants'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {restaurants
              ?.filter(
                (restaurant: RestaurantResponse) =>
                  restaurant &&
                  restaurant.address &&
                  restaurant.latitude &&
                  restaurant.longitude &&
                  restaurant.name &&
                  restaurant.location_id
              )
              .map((restaurant: RestaurantResponse, index: number) => (
                <div
                  key={index}
                  className='relative'
                >
                  <RestaurantCard
                    key={index}
                    restaurant={restaurant}
                    destination={destination.placesDetails?.name}
                  />
                  <div className='absolute top-2 right-2'>
                    <WishlistButton
                      itemId={restaurant.location_id}
                      itemType='restaurant'
                      itemData={{
                        id: restaurant.location_id,
                        name: restaurant.name,
                        country:
                          restaurant.address?.split(',').pop()?.trim() || '',
                        city: restaurant.address?.split(',')[0]?.trim() || '',
                        image:
                          restaurant.photo?.images?.large?.url ||
                          '/placeholder.webp',
                        description: restaurant.description || '',
                        coordinates: {
                          lat:
                            typeof restaurant.latitude === 'string'
                              ? Number.parseFloat(restaurant.latitude)
                              : restaurant.latitude || 0,
                          lng:
                            typeof restaurant.longitude === 'string'
                              ? Number.parseFloat(restaurant.longitude)
                              : restaurant.longitude || 0,
                        },
                        rating: parseInt(restaurant?.ranking || '4') || 0,
                        address: restaurant.address,
                        price: restaurant.price_level || '',
                      }}
                      size='icon'
                    />
                  </div>
                </div>
              ))}
          </div>
          <Card className='mt-6 md:col-span-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2'>
                <MapIcon className='h-5 w-5' />
                Map for Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-[400px]'>
                <div className='text-sm text-muted-foreground w-full h-[400px]'>
                  <MapView
                    places={
                      restaurants
                        ?.filter(
                          (restaurant: RestaurantResponse) =>
                            restaurant &&
                            restaurant.address &&
                            restaurant.latitude &&
                            restaurant.longitude &&
                            restaurant.name &&
                            restaurant.location_id
                        )
                        .map((attraction: RestaurantResponse) => ({
                          name: attraction?.name ?? 'dublin',
                          lat:
                            typeof attraction?.latitude === 'string'
                              ? Number.parseFloat(attraction.latitude)
                              : attraction.latitude ?? 0,
                          lng:
                            typeof attraction?.longitude === 'string'
                              ? Number.parseFloat(attraction.longitude)
                              : attraction.longitude ?? 0,
                          photoUrl:
                            attraction?.photo?.images?.large?.url ??
                            '/placeholder.webp',
                        })) ?? []
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='travel-info'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              {destination?.transportation &&
                destination?.transportation?.length > 0 && (
                  <Transportation destination={destination} />
                )}

              <Card>
                <CardHeader>
                  <CardTitle>Currency & Money</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='mb-2 font-medium'>Currency</h3>
                      <p className='text-muted-foreground'>
                        {currency ?? ''} ({currencySymbol ?? ''})
                      </p>
                    </div>
                    <div>
                      <h3 className='mb-2 font-medium'>Currency Code</h3>
                      <p className='text-muted-foreground'>
                        {currencyCode ?? ''}
                      </p>
                    </div>
                    <div>
                      <h3 className='mb-2 font-medium'>Exchange Rate</h3>
                      <p className='text-muted-foreground'>
                        {currencyExchangeRate ?? ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* <Card className='mt-6 md:col-span-1'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2'>
                    <MapIcon className='h-5 w-5' />
                    Map for Local Guides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='aspect-square bg-muted rounded-md flex items-center justify-center w-full h-[400px]'>
                    <div className='text-sm text-muted-foreground w-full h-[400px]'>
                      <MapView
                        places={
                          destination.localGuides?.map((attraction: any) => ({
                            name: attraction?.hotelName ?? 'dublin',
                            lat: attraction?.geoCoordinates?.latitude ?? 0,
                            lng: attraction?.geoCoordinates?.longitude ?? 0,
                            photoUrl: '/placeholder.webp',
                          })) ?? []
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            <div className='space-y-4'>
              <LocalGuides
                guides={destination?.localGuides ?? []}
                destinationName={destination?.placesDetails?.name}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value='alerts'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
            {securityAlerts && securityAlerts?.length > 0 && (
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle>Safety Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecurityAlerts slerts={securityAlerts} />
                </CardContent>
              </Card>
            )}
            {fraudAlerts && fraudAlerts?.length > 0 && (
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle>Fraud Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FraudAlerts alertsData={fraudAlerts} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value='reviews'>
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>
                What travelers are saying about {name ?? ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <div className='flex items-center'>
                    <RatingComponent rating={destination?.rating ?? 0} />
                    <span className='text-3xl font-bold ml-2'>
                      {destination?.rating ?? 0}
                    </span>
                    <span className='ml-2 text-muted-foreground'>
                      {' '}
                      out of 5
                    </span>
                  </div>
                </div>
              </div>

              <Separator className='mb-6' />

              <div className='space-y-6'>
                <div className='mb-2 flex flex-col items-start w-full'>
                  {reviews?.map(
                    (
                      review: {
                        review: string;
                        rating: number;
                        reviewer: string;
                      },
                      i: number
                    ) => (
                      <div
                        key={i}
                        className='w-full'
                      >
                        <h3 className='font-semibold mb-2'>
                          {review?.reviewer}
                        </h3>
                        <RatingComponent rating={review?.rating ?? 0} />
                        <p className='mt-2 text-muted-foreground whitespace-normal'>
                          {review?.review ?? 'No Review'}
                        </p>
                        <Separator className='my-2 w-full' />
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='weather'>
          <Card>
            <CardHeader>
              <CardTitle>Weather Updates</CardTitle>
              <CardDescription>
                Current weather at your destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherDashboard
                destination={{
                  name: placesDetails?.name ?? '',
                  lat: placesDetails?.geometry?.location?.lat ?? 0,
                  lng: placesDetails?.geometry?.location?.lng ?? 0,
                  timezone: placesDetails?.timezone ?? '',
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
