import { attractionKeys } from '@/datamodels/attractionsmodel';
import { hotelKeys } from '@/datamodels/hotelmodels';
import { restaurantKeys } from '@/datamodels/testraurantsmodel';
import axios from 'axios';

export const getPlaceReviews = async (placeId: string) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/reviews/list?`,
      {
        params: {
          location_id: placeId,
        },
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    console.log('Reviews:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getPlacePhotos = async (placeId: string) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/photos/list??`,
      {
        params: {
          location_id: placeId,
        },
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    console.log('Reviews:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getPlaceTips = async (placeId: string) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/tips/list?`,
      {
        params: {
          location_id: placeId,
        },
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    console.log('Reviews:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

const getObjectKeys = (key: getPlacesBYBoundaryType) => {
  if (key === getPlacesBYBoundaryType.ATTRACTIONS) {
    return attractionKeys;
  } else if (key === getPlacesBYBoundaryType.RESTAURANTS) {
    return restaurantKeys;
  } else if (key === getPlacesBYBoundaryType.HOTELS) {
    return hotelKeys;
  }
};
export enum getPlacesBYBoundaryType {
  HOTELS = 'hotels',
  RESTAURANTS = 'restaurants',
  ATTRACTIONS = 'attractions',
}

export const getPlacesBYBoundary = async (
  type: getPlacesBYBoundaryType,
  sw: { lat: number; lng: number },
  ne: { lat: number; lng: number },
  currency: string = 'USD'
) => {
  try {
    const params = {
      bl_latitude: sw.lat,
      bl_longitude: sw.lng,
      tr_latitude: ne.lat,
      tr_longitude: ne.lng,
      currency: currency,
      limit: 50,
    };

    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params,
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    const keys = getObjectKeys(type);

    if (!keys) return [];

    const filteredData = response?.data?.data?.map((place: any) =>
      Object.fromEntries(
        Object.entries(place).filter(([key]) =>
          (keys as Array<keyof typeof place>).includes(
            key as keyof typeof place
          )
        )
      )
    );

    return filteredData || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const getPlacesByLatLong = async (
  type: getPlacesBYBoundaryType,
  lat: number,
  lng: number,
  currency: string = 'USD'
) => {
  try {
    const params = {
      latitude: lat,
      longitude: lng,
      currency: currency,
    };

    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-by-latlng`,
      {
        params,
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );

    const keys = getObjectKeys(type);

    if (!keys) return [];

    const filteredData = response?.data?.data?.map((place: any) =>
      Object.fromEntries(
        Object.entries(place).filter(([key]) =>
          (keys as Array<keyof typeof place>).includes(
            key as keyof typeof place
          )
        )
      )
    );

    return filteredData || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string,
  type: getPlacesBYBoundaryType,
  currency: string = 'USD'
) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/get-details`,
      {
        params: {
          location_id: placeId,
          currency: currency,
        },
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    console.log('Reviews:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};
export const getHotelsByLocationId = async (locationId: string) => {
  try {
    if (!locationId) {
      console.error('Location ID is required');
      return [];
    }

    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/hotels/list`,
      {
        params: {
          location_id: locationId,
        },
        headers: {
          'x-rapidapi-key':
            process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY || '',
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );

    console.log('Hotels:', response.data);
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching hotels:', error.message);
    if (error.response) {
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Unknown Error:', error.message);
    }
    return [];
  }
};

export const getTourGuidesData = async (location: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: `tour guide in ${location}`,
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        },
      }
    );
    console.log('Tour Guides:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tour guides data:', error.message);
    if (error.response) {
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    }
    // Handle network error more explicitly
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Check your connection or proxy setup.');
    }
    return []; // Return an empty array or handle as needed
  }
};

export const getTourGuideDetailsFromPlace = async (placeId: string) => {
  try {
    const response = await axios(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,photos,website,address_component,formatted_address,international_phone_number,opening_hours,url,geometry,place_id,types,user_ratings_total,user_ratings_percentile,price_level&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = response.data;
    return data.result;
  } catch (error) {
    console.error('Error fetching tour guide details:', error);
  }
};

export const getTravelAdvisorLocationId = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/locations/search`,
      {
        params: {
          query: `${lat},${lng}`,
          limit: '1',
        },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_TRAVEL_ADVISOR_API_KEY,
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    return response.data?.data[0]?.location_id || 'No Location ID found';
  } catch (error) {
    console.error('Error fetching Travel Advisor location ID:', error);
    return null;
  }
};
