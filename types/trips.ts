export interface TripRequest {
  destination: string
  startDate: string
  endDate: string
  travelers: number
  budget: string
  interests: string[]
}

export interface Trip {
  id: string
  userId: string
  destination: Destination
  dates: {
    start: string
    end: string
    days: number
  }
  travelers: number
  budget: string
  interests: string[]
  createdAt: string
  updatedAt?: string
  status: "planned" | "ongoing" | "completed" | "cancelled"
  itinerary: Itinerary
}

export interface Destination {
  id: string
  name: string
  country: string
  city?: string
  description?: string
  photos: string[]
  coordinates: {
    lat: number
    lng: number
  }
  timezone: string
  formatted_address: string
}

export interface Itinerary {
  overview: string
  days: ItineraryDay[]
}

export interface ItineraryDay {
  day: number
  date: string
  activities: Activity[]
}

export interface Activity {
  id: string
  type: "attraction" | "restaurant" | "hotel" | "transport" | "other"
  name: string
  description?: string
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  startTime?: string
  endTime?: string
  photo?: string
  price?: string
  notes?: string
}

export interface TripsResponse {
  success: boolean
  message?: string
  trips: Trip[]
}

export interface TripResponse {
  success: boolean
  message?: string
  trip: Trip
}

export interface TripCreateResponse {
  success: boolean
  message?: string
  trip: Trip
}

export interface TripUpdateResponse {
  success: boolean
  message?: string
  trip: Trip
}

export interface TripDeleteResponse {
  success: boolean
  message?: string
}
