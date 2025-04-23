import { apiClient } from './api-client';
import { auth } from './firebase';

export interface ProfileData {
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  location: string;
  phoneNumber: string;
  settings?: any;
}

export interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
}

export const profileService = {
  getProfile: async (): Promise<{
    success: boolean;
    profile?: ProfileData;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        profile: ProfileData;
      }>('/api/profile');
      return response?.data || { success: false, message: 'No data received' };
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch profile',
      };
    }
  },

  updateProfile: async (
    data: ProfileUpdateData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      return await apiClient.put<{ success: boolean; message: string }>(
        '/api/profile',
        data
      );
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile',
      };
    }
  },

  uploadProfilePhoto: async (
    file: File
  ): Promise<{ success: boolean; photoURL?: string; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/photo', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${auth.currentUser?.uid}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload profile photo');
      }

      return {
        success: true,
        photoURL: data.photoURL,
        message: data.message,
      };
    } catch (error: any) {
      console.error('Upload profile photo error:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload profile photo',
      };
    }
  },

  deleteAccount: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      return await apiClient.delete<{ success: boolean; message: string }>(
        '/api/profile/delete'
      );
    } catch (error: any) {
      console.error('Delete account error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete account',
      };
    }
  },
};
