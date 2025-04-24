'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  removeTopDestinationsFromLocalStorage,
  removeUserDataFromLocalStorage,
} from '@/lib/localstorage';
import {
  profileService,
  type ProfileData,
  type ProfileUpdateData,
} from '@/lib/profile-service';
import { getCurrentUser } from '@/lib/auth-helpers';
import { auth, storage } from '@/lib/firebase';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    phoneNumber: '',
    photoURL: '',
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await profileService.getProfile();
          console.log('Profile response:', response);
          if (response.success && response.profile) {
            setProfileData(response.profile);
          } else {
            setError('Failed to load profile data. Please try again.');
            toast({
              title: 'Error',
              description: response.message || 'Failed to load profile data',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load profile data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (user && !authLoading) {
      fetchUserProfile();
      getCurrentUser();
    }
  }, [user, authLoading, toast]);
  const uploadPhoto = async () => {
    if (!user || !newPhoto) return null;

    const fileRef = ref(storage, `profile-photos/${user.uid}`);
    await uploadBytes(fileRef, newPhoto);
    return getDownloadURL(fileRef);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadPhoto = async () => {
    if (!newPhoto) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      const response = await uploadPhoto();

      if (response) {
        setProfileData({
          ...profileData,
          photoURL: response.toString(),
        });
        setNewPhoto(null);
        toast({
          title: 'Profile photo updated',
          description: 'Your profile photo has been successfully updated.',
        });
      } else {
        setError(response || 'Failed to upload profile photo');
        toast({
          title: 'Error',
          description: response || 'Failed to upload profile photo',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      setError('Failed to upload profile photo. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to upload profile photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      if (newPhoto) {
        await handleUploadPhoto();
      }

      const updateData: ProfileUpdateData = {
        displayName: profileData.displayName,
        bio: profileData.bio,
        location: profileData.location,
        phoneNumber: profileData.phoneNumber,
      };

      const response = await profileService.updateProfile(updateData);

      if (response.success) {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      } else {
        setError(response.message || 'Failed to update profile');
        toast({
          title: 'Error',
          description: response.message || 'Failed to update your profile',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const response = await profileService.deleteAccount();

      if (response.success) {
        if (auth.currentUser) {
          await auth.currentUser.delete();
        } else {
          throw new Error('No authenticated user found.');
        }
        toast({
          title: 'Account Deleted',
          description: 'Your account has been successfully deleted.',
        });
        removeTopDestinationsFromLocalStorage();
        removeUserDataFromLocalStorage();
        router.push('/login');
      } else {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Profile Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account information and preferences
        </p>
      </div>

      {error && (
        <Alert
          variant='destructive'
          className='mb-6'
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue='personal'
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='personal'>Personal Information</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>

        <TabsContent value='personal'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col items-center'>
                <Avatar className='h-32 w-32'>
                  {newPhoto || profileData.photoURL ? (
                    <AvatarImage
                      src={
                        newPhoto
                          ? URL.createObjectURL(newPhoto)
                          : profileData.photoURL
                      }
                      alt={profileData.displayName || 'User'}
                    />
                  ) : (
                    <AvatarFallback>
                      {profileData.displayName.charAt(0) ||
                        user.email?.charAt(0) ||
                        'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className='mt-4 w-full'>
                  <input
                    type='file'
                    ref={fileInputRef}
                    accept='image/*'
                    onChange={handlePhotoChange}
                    className='hidden'
                  />
                  <div className='flex flex-col gap-2'>
                    <Button
                      onClick={handleUploadButtonClick}
                      variant='outline'
                      className='w-full'
                      disabled={uploadingPhoto}
                    >
                      <Upload className='mr-2 h-4 w-4' />
                      Choose Photo
                    </Button>
                    {newPhoto && (
                      <Button
                        onClick={handleUploadPhoto}
                        className='w-full'
                        disabled={uploadingPhoto}
                      >
                        {uploadingPhoto ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Uploading...
                          </>
                        ) : (
                          'Upload Photo'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='displayName'>Full Name</Label>
                  <Input
                    id='displayName'
                    name='displayName'
                    value={profileData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    value={profileData.email}
                    disabled
                  />
                  <p className='text-xs text-muted-foreground'>
                    Email cannot be changed
                  </p>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phoneNumber'>Phone Number</Label>
                  <Input
                    id='phoneNumber'
                    name='phoneNumber'
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    name='location'
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder='City, Country'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea
                    id='bio'
                    name='bio'
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder='Tell us about yourself and your travel experiences'
                    className='min-h-[100px]'
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='mt-6 flex justify-end'>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='mb-2 text-lg font-medium'>Change Password</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Update your password to keep your account secure
                </p>
                <Button
                  variant='outline'
                  onClick={() => router.push('/reset-password')}
                >
                  Change Password
                </Button>
              </div>

              <div className='pt-4'>
                <h3 className='mb-2 text-lg font-medium'>Delete Account</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Permanently delete your account and all associated data
                </p>
                <Button
                  variant='destructive'
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action will permanently delete your account and all your data.
            This cannot be undone.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant='outline'
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant='destructive'
              onClick={handleDeleteAccount}
              disabled={saving}
            >
              {saving ? 'Deleting...' : 'Confirm Deletion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
