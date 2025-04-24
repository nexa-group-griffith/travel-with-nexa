import { apiClient } from './api-client';

export interface UserSettings {
  notifications: {
    email: boolean;
    tripReminders: boolean;
    marketingEmails: boolean;
    appNotifications: boolean;
  };
  display: {
    currency: string;
    temperatureUnit: string;
    distanceUnit: string;
    language: string;
  };
  privacy: {
    shareTrips: boolean;
    shareReviews: boolean;
    publicProfile: boolean;
  };
}

export const settingsService = {
  getSettings: async (): Promise<{
    success: boolean;
    settings?: UserSettings;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        settings: UserSettings;
      }>('/api/settings');
      if (response.data) {
        return response.data;
      } else {
        return {
          success: false,
          message: 'No data received from the server',
        };
      }
    } catch (error: any) {
      console.error('Get settings error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch settings',
      };
    }
  },

  updateSettings: async (
    settings: UserSettings
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      return await apiClient.put<{ success: boolean; message: string }>(
        '/api/settings',
        {
          settings,
        }
      );
    } catch (error: any) {
      console.error('Update settings error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update settings',
      };
    }
  },
};
