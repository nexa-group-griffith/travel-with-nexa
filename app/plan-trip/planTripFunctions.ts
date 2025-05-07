import type { PlaceResult } from '@/components/place-search';
import type { AttractionResponse } from '@/datamodels/attractionsmodel';
import type { HotelResponse } from '@/datamodels/hotelmodels';
import type { RestaurantResponse } from '@/datamodels/testraurantsmodel';
import type {
  OtherDetailsResponse,
  TripDetailsResponse,
} from '@/datamodels/tripmodels';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import {
  generateLocalGuides,
  type localGuideResponse,
} from '@/lib/generate-local-guides';
import { generateTripItinerary } from '@/lib/generate-trip-itinerary';
import {
  getPlacesBYBoundary,
  getPlacesBYBoundaryType,
  getPlacesByLatLong,
} from '@/lib/get-travel-adviser-data';
import {
  getFallbackHotels,
  getFallbackRestaurants,
  getFallbackAttractions,
} from '@/lib/static-fallback-data';
import type { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { Dispatch, SetStateAction } from 'react';
import { v4 } from 'uuid';

interface TripParams {
  destination: PlaceResult;
  days: number;
  travelers: number;
  budget: string;
  interests: string[];
  setError: Dispatch<SetStateAction<string | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  user: User;
}

export const handleCreateTripFunction = async ({
  setError,
  ...params
}: TripParams): Promise<string | null | undefined> => {
  const {
    destination,
    days,
    travelers,
    budget,
    interests,
    setLoading,
    dateRange,
    user,
  } = params;

  if (!destination) {
    setError('Please select a destination');
    return null;
  }

  if (!dateRange.from || !dateRange.to) {
    setError('Please select travel dates');
    return null;
  }

  setLoading(true);
  setError(null);

  try {
    let days = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    days = days === 0 ? 1 : days;

    const hotelsData: HotelResponse[] = await getPlacesByLatLong(
      getPlacesBYBoundaryType.HOTELS,
      destination?.geometry?.location?.lat || 0,
      destination?.geometry?.location?.lng || 0
    );

    const hotelsData1: HotelResponse[] = await getPlacesBYBoundary(
      getPlacesBYBoundaryType.HOTELS,
      {
        lat: destination?.geometry?.viewport?.southwest?.lat || 0,
        lng: destination?.geometry?.viewport?.southwest?.lng || 0,
      },
      {
        lat: destination?.geometry?.viewport?.northeast?.lat || 0,
        lng: destination?.geometry?.viewport?.northeast?.lng || 0,
      }
    );

    const restaurantsData: RestaurantResponse[] = await getPlacesByLatLong(
      getPlacesBYBoundaryType.RESTAURANTS,
      destination?.geometry?.location?.lat || 0,
      destination?.geometry?.location?.lng || 0
    );

    const restaurantsData1: RestaurantResponse[] = await getPlacesBYBoundary(
      getPlacesBYBoundaryType.RESTAURANTS,
      {
        lat: destination?.geometry?.viewport?.southwest?.lat || 0,
        lng: destination?.geometry?.viewport?.southwest?.lng || 0,
      },
      {
        lat: destination?.geometry?.viewport?.northeast?.lat || 0,
        lng: destination?.geometry?.viewport?.northeast?.lng || 0,
      }
    );

    const attractionsData: AttractionResponse[] = await getPlacesByLatLong(
      getPlacesBYBoundaryType.ATTRACTIONS,
      destination?.geometry?.location?.lat || 0,
      destination?.geometry?.location?.lng || 0
    );
    const attractionsData1: AttractionResponse[] = await getPlacesBYBoundary(
      getPlacesBYBoundaryType.ATTRACTIONS,
      {
        lat: destination?.geometry?.viewport?.southwest?.lat || 0,
        lng: destination?.geometry?.viewport?.southwest?.lng || 0,
      },
      {
        lat: destination?.geometry?.viewport?.northeast?.lat || 0,
        lng: destination?.geometry?.viewport?.northeast?.lng || 0,
      }
    );
    // const localGuides = await getTourGuidesData(
    //   destination?.formatted_address || ''
    // );
    // const localGuides1 = await axios.get(
    //   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destination?.formatted_address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    // );

    const otherDetails: OtherDetailsResponse = await generateTripItinerary({
      destination: destination?.formatted_address || destination?.name,
      days,
      travelers,
      budget,
      interests,
    });

    const generateLocalGuidesData: localGuideResponse[] =
      await generateLocalGuides(
        destination?.formatted_address || destination?.name
      );

    console.log(
      'hotelsData',
      hotelsData,
      hotelsData1,
      'restaurantsData',
      restaurantsData1,
      'activitiesData',
      attractionsData1,
      // localGuides,
      // localGuides1,
      otherDetails,
      generateLocalGuidesData
    );
    const flattenArray = (arr: any[]) => arr.map((item) => ({ ...item }));

    // Use fallback data if API results are empty
    const hotels = [
      ...flattenArray(hotelsData?.length ? hotelsData : hotelsData1),
    ];
    const finalHotels =
      hotels.length > 0
        ? hotels
        : getFallbackHotels(
            destination?.formatted_address || destination?.name
          );

    const restaurants = [
      ...flattenArray(
        restaurantsData?.length > 0 ? restaurantsData : restaurantsData1
      ),
    ];
    const finalRestaurants =
      restaurants.length > 0
        ? restaurants
        : getFallbackRestaurants(
            destination?.formatted_address || destination?.name
          );

    const attractions = [
      ...flattenArray(
        attractionsData?.length > 0 ? attractionsData : attractionsData1
      ),
    ];
    const finalAttractions =
      attractions.length > 0
        ? attractions
        : getFallbackAttractions(
            destination?.formatted_address || destination?.name
          );

    const tripId = v4();
    if (db) {
      const tripData: TripDetailsResponse = {
        id: tripId,
        userId: user.uid,
        placesDetails: destination,
        dates: {
          start: dateRange.from.toISOString(),
          end: dateRange.to.toISOString(),
          days: days,
        },
        travelers,
        budget,
        interests,
        createdAt: new Date().toISOString(),
        hotels: finalHotels,
        restaurants: finalRestaurants,
        attractions: finalAttractions,
        ...otherDetails,
        transportation: otherDetails.transportation,
        fraudAlerts: otherDetails.fraudAlerts,
        localGuides: [...flattenArray(generateLocalGuidesData)],
        rating: otherDetails?.rating || 0,
      };
      console.log('Document written with ID: ', tripData);
      const doc_ref = await setDoc(
        doc(db, 'users', user.uid, 'trips', tripId),
        tripData
      );
      toast({
        title: 'Trip created!',
        description: `Your trip to ${destination.formatted_address} has been created.`,
      });
      return tripId;
    }
  } catch (error: any) {
    console.error('Error creating trip:', error);
    setError(error.message || 'Failed to create trip. Please try again.');

    toast({
      title: 'Error',
      description: 'Failed to create trip. Please try again.',
      variant: 'destructive',
    });
    return null;
  } finally {
    setLoading(false);
  }

  return null;
};
