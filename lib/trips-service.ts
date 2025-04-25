import { apiClient } from './api-client';
import type {
  Trip,
  TripRequest,
  TripsResponse,
  TripResponse,
  TripCreateResponse,
  TripUpdateResponse,
  TripDeleteResponse,
} from '@/types/trips';

export const tripsService = {
  getAllTrips: async (): Promise<TripsResponse> => {
    try {
      const response = await apiClient.get<TripsResponse>('/api/trips');
      return response.data || { success: false, message: 'No data', trips: [] };
    } catch (error) {
      console.error('Get all trips error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to fetch trips',
        trips: [],
      };
    }
  },

  getUpcomingTrips: async (): Promise<TripsResponse> => {
    try {
      const response = await apiClient.get<TripsResponse>('/api/trips');
      return response.data || { success: false, message: 'No data', trips: [] };
    } catch (error) {
      console.error('Get upcoming trips error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to fetch upcoming trips',
        trips: [],
      };
    }
  },

  getPastTrips: async (): Promise<TripsResponse> => {
    try {
      return await apiClient.get<TripsResponse>('/api/trips?status=completed');
    } catch (error) {
      console.error('Get past trips error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to fetch past trips',
        trips: [],
      };
    }
  },

  getTripById: async (id: string): Promise<TripResponse> => {
    try {
      return await apiClient.get<TripResponse>(`/api/trips/${id}`);
    } catch (error) {
      console.error('Get trip by ID error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to fetch trip details',
        trip: {} as Trip,
      };
    }
  },

  createTrip: async (tripData: TripRequest): Promise<TripCreateResponse> => {
    try {
      return await apiClient.post<TripCreateResponse>('/api/trips', tripData);
    } catch (error) {
      console.error('Create trip error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to create trip',
        trip: {} as Trip,
      };
    }
  },

  updateTrip: async (
    id: string,
    tripData: Partial<Trip>
  ): Promise<TripUpdateResponse> => {
    try {
      return await apiClient.put<TripUpdateResponse>(
        `/api/trips/${id}`,
        tripData
      );
    } catch (error) {
      console.error('Update trip error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to update trip',
        trip: {} as Trip,
      };
    }
  },

  deleteTrip: async (id: string): Promise<TripDeleteResponse> => {
    try {
      return await apiClient.delete<TripDeleteResponse>(`/api/trips/${id}`);
    } catch (error) {
      console.error('Delete trip error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to delete trip',
      };
    }
  },
};
