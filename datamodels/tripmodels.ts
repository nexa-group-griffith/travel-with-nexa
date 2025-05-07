import { RestaurantResponse } from './testraurantsmodel';
import { HotelResponse } from './hotelmodels';
import { AttractionResponse } from './attractionsmodel';
import { PlaceResult } from '@/components/place-search';
import { localGuideResponse } from '@/lib/generate-local-guides';

export interface TripDetailsResponse {
  id: string;
  userId: string;
  placesDetails: PlaceResult;
  dates: {
    start: string;
    end: string;
    days: number;
  };
  travelers: number;
  budget: string;
  interests: string[];
  createdAt: string;
  rating: number;
  overview: string;
  restaurants: RestaurantResponse[];
  hotels: HotelResponse[];
  attractions: AttractionResponse[];
  reviews?: { rating: number; review: string; reviewer: string }[];
  securityAlerts?: {
    type: string;
    title: string;
    description: string;
    severity: string;
  }[];
  fraudAlerts?: {
    type: string;
    title: string;
    description: string;
    severity: string;
  }[];
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  currencyExchangeRate: string;
  languages: string[];
  transportation: {
    type: string;
    name: string;
    description: string;
  }[];
  localGuides: localGuideResponse[];
}

export interface OtherDetailsResponse {
  rating: number;
  overview: string;
  reviews?: { rating: number; review: string; reviewer: string }[];
  securityAlerts?: {
    type: string;
    title: string;
    description: string;
    severity: string;
  }[];
  fraudAlerts?: {
    type: string;
    title: string;
    description: string;
    severity: string;
  }[];
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  currencyExchangeRate: string;
  languages: string[];
  transportation: {
    type: string;
    name: string;
    description: string;
  }[];
}
