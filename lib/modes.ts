interface GeoCoordinates {
  longitude: number
  latitude: number
}

export interface Hotel {
  hotelName: string
  hotelAddress: string
  price: string
  hotelImageUrl: string
  geoCoordinates: GeoCoordinates
  rating: string
  description: string
  hoteltype: string
}

export interface Restaurant {
  restaurantName: string
  restaurantAddress: string
  price: string
  restaurantImageUrl: string
  geoCoordinates: GeoCoordinates
  rating: string
  description: string
  foodType: string
}

export interface Attraction {
  attractionName: string
  address: string
  price: string
  imageUrl: string
  geoCoordinates: GeoCoordinates
  rating: string
  description: string
  openingTime: string
  closingTime: string
}

interface ItineraryItem {
  placeName: string
  placeDetails: string
  placeImageUrl: string
  geoCoordinates: GeoCoordinates
  ticketPricing: string
  tips: string
  timeToTravel: string
}

interface ItineraryDay {
  day: number
  plan: ItineraryItem[]
}

export interface TravelPlan {
  rating: number
  destination: string
  location: string
  country: string
  duration: string
  timezone: string
  geoCoordinates: GeoCoordinates
  budget: string
  currency: string
  currencyCode: string
  currencySymbol: string
  currencyExchangeRate: string
  language: string
  transportation: string[]
  hotels: Hotel[]
  restaurants: Restaurant[]
  attractions: Attraction[]
  itinerary: ItineraryDay[]
  reviews: { rating: number; review: string }[]
  securityAlerts: {
    type: string
    title: string
    description: string
    severity: string
  }[]
}

export interface TripDetails {
  budget: string
  createdAt: string
  date: {
    start: string
    end: string
    days: number
  }
  destination: {
    name: string
    country: string
    location: {
      lat: string
      lng: string
    }
  }
  interests: string[]
  status: string
  travelers: number
  userId: string
  localGuides: localGuide[]
  itinerary: {
    overview: string
    travelPlan: TravelPlan
  }
}

export interface localGuide {
  name: string
  type: string
  description: string
  address: string
  latitude: number
  longitude: number
  website: string
  phone: string
}

export interface TopDestination {
  id: string
  name: string
  country: string
  city: string
  imageUrl: string
  description: string
  rating: number
  budget: string
  tags: string[]
}

export interface WeatherResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: CurrentWeather
  minutely: MinuteForecast[]
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

interface CurrentWeather {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  weather: Weather[]
}

interface MinuteForecast {
  dt: number
  precipitation: number
}

interface HourlyForecast {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Weather[]
  pop: number
  rain?: Rain
}

interface DailyForecast {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  summary: string
  temp: TemperatureRange
  feels_like: TemperatureRange
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Weather[]
  clouds: number
  pop: number
  rain?: number
  uvi: number
}

interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

interface Rain {
  "1h": number
}

interface TemperatureRange {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}
