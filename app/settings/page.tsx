'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { settingsService, type UserSettings } from '@/lib/settings-service';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      tripReminders: true,
      marketingEmails: false,
      appNotifications: true,
    },
    display: {
      currency: 'USD',
      temperatureUnit: 'celsius',
      distanceUnit: 'km',
      language: 'en',
    },
    privacy: {
      shareTrips: false,
      shareReviews: true,
      publicProfile: false,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/settings');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await settingsService.getSettings();

        if (response.success && response.settings) {
          setSettings(response.settings);
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to load settings',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error fetching settings:', error);
        setError(error.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchSettings();
    }
  }, [user, authLoading, toast]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await settingsService.updateSettings(settings);

      if (response.success) {
        toast({
          title: 'Settings saved',
          description: 'Your settings have been updated successfully',
        });
      } else {
        setError(response.message || 'Failed to save settings');
        toast({
          title: 'Error',
          description: response.message || 'Failed to save settings',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Failed to save settings');
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle notification settings changes
  const handleNotificationChange = (
    key: keyof typeof settings.notifications,
    value: boolean
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  // Handle display settings changes
  const handleDisplayChange = (
    key: keyof typeof settings.display,
    value: string
  ) => {
    setSettings({
      ...settings,
      display: {
        ...settings.display,
        [key]: value,
      },
    });
  };

  // Handle privacy settings changes
  const handlePrivacyChange = (
    key: keyof typeof settings.privacy,
    value: boolean
  ) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className='container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences
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
        defaultValue='notifications'
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='display'>Display</TabsTrigger>
          <TabsTrigger value='privacy'>Privacy</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
        </TabsList>

        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Email Notifications</h3>
                  <p className='text-sm text-muted-foreground'>
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(value) =>
                    handleNotificationChange('email', value)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Trip Reminders</h3>
                  <p className='text-sm text-muted-foreground'>
                    Get reminders about upcoming trips
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.tripReminders}
                  onCheckedChange={(value) =>
                    handleNotificationChange('tripReminders', value)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Marketing Emails</h3>
                  <p className='text-sm text-muted-foreground'>
                    Receive promotional emails and offers
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(value) =>
                    handleNotificationChange('marketingEmails', value)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>App Notifications</h3>
                  <p className='text-sm text-muted-foreground'>
                    Receive in-app notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.appNotifications}
                  onCheckedChange={(value) =>
                    handleNotificationChange('appNotifications', value)
                  }
                />
              </div>

              <Button
                onClick={handleSaveSettings}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='display'>
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency</Label>
                <select
                  id='currency'
                  value={settings.display.currency}
                  onChange={(e) =>
                    handleDisplayChange('currency', e.target.value)
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                >
                  <option value='USD'>USD ($)</option>
                  <option value='EUR'>EUR (€)</option>
                  <option value='GBP'>GBP (£)</option>
                  <option value='JPY'>JPY (¥)</option>
                  <option value='AUD'>AUD ($)</option>
                </select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='temperature'>Temperature Unit</Label>
                <select
                  id='temperature'
                  value={settings.display.temperatureUnit}
                  onChange={(e) =>
                    handleDisplayChange('temperatureUnit', e.target.value)
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                >
                  <option value='celsius'>Celsius (°C)</option>
                  <option value='fahrenheit'>Fahrenheit (°F)</option>
                </select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='distance'>Distance Unit</Label>
                <select
                  id='distance'
                  value={settings.display.distanceUnit}
                  onChange={(e) =>
                    handleDisplayChange('distanceUnit', e.target.value)
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                >
                  <option value='km'>Kilometers (km)</option>
                  <option value='mi'>Miles (mi)</option>
                </select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='language'>Language</Label>
                <select
                  id='language'
                  value={settings.display.language}
                  onChange={(e) =>
                    handleDisplayChange('language', e.target.value)
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                >
                  <option value='en'>English</option>
                  <option value='es'>Spanish</option>
                  <option value='fr'>French</option>
                  <option value='de'>German</option>
                  <option value='ja'>Japanese</option>
                </select>
              </div>

              <Button
                onClick={handleSaveSettings}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='privacy'>
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Share Trip Information</h3>
                  <p className='text-sm text-muted-foreground'>
                    Allow others to see your trips
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareTrips}
                  onCheckedChange={(value) =>
                    handlePrivacyChange('shareTrips', value)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Share Reviews</h3>
                  <p className='text-sm text-muted-foreground'>
                    Make your reviews public
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareReviews}
                  onCheckedChange={(value) =>
                    handlePrivacyChange('shareReviews', value)
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium'>Public Profile</h3>
                  <p className='text-sm text-muted-foreground'>
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={(value) =>
                    handlePrivacyChange('publicProfile', value)
                  }
                />
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Data & Privacy</h3>
                <div className='space-y-2'>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    Download My Data
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                  >
                    Privacy Policy
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start text-destructive hover:text-destructive'
                  >
                    Delete Account
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='account'>
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  value={user.email || ''}
                  disabled
                />
                <p className='text-xs text-muted-foreground'>
                  Your email address cannot be changed
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  defaultValue={user.displayName || ''}
                />
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Password</h3>
                <Button
                  variant='outline'
                  asChild
                  className='w-full justify-start'
                >
                  <Link href='/reset-password'>Change Password</Link>
                </Button>
              </div>

              <Button
                onClick={handleSaveSettings}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
