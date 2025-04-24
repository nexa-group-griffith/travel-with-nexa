'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  Sunrise,
  Sunset,
  CloudLightning,
  CloudFog,
  ArrowUp,
  ArrowDown,
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { WeatherResponse } from '@/lib/modes';
import { format, fromUnixTime } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

interface Destination {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}
export default function WeatherDashboard({
  destination,
}: {
  destination?: Destination;
}) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('Dublin, Ireland');

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${
            destination?.lat || 53.349805
          }&lon=${destination?.lng || -6.26031}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data: WeatherResponse = await res.json();
        console.log('hhhhhhhhhh', data);
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(
          'Failed to load weather data. Please check your API key and try again.'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    if (!destination) return;
    setLocation(`${destination?.name}`);
  }, []);

  const getWeatherIcon = (condition: string, size = 8) => {
    const iconClass = `h-${size} w-${size}`;

    if (condition.includes('thunderstorm')) {
      return (
        <CloudLightning
          className={`${iconClass} text-purple-500 dark:text-purple-400`}
        />
      );
    } else if (condition.includes('drizzle')) {
      return (
        <CloudDrizzle
          className={`${iconClass} text-blue-400 dark:text-blue-300`}
        />
      );
    } else if (condition.includes('rain')) {
      return (
        <CloudRain
          className={`${iconClass} text-blue-500 dark:text-blue-400`}
        />
      );
    } else if (condition.includes('snow')) {
      return (
        <CloudSnow
          className={`${iconClass} text-blue-200 dark:text-blue-300`}
        />
      );
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return (
        <CloudFog className={`${iconClass} text-gray-400 dark:text-gray-300`} />
      );
    } else if (condition.includes('clear')) {
      return (
        <Sun className={`${iconClass} text-yellow-500 dark:text-yellow-300`} />
      );
    } else if (condition.includes('cloud')) {
      return (
        <Cloud className={`${iconClass} text-gray-500 dark:text-gray-300`} />
      );
    } else {
      return (
        <Sun className={`${iconClass} text-yellow-500 dark:text-yellow-300`} />
      );
    }
  };

  const formatTime = (timestamp: number) => {
    if (!destination?.timezone) return '';

    const zonedTime = toZonedTime(
      fromUnixTime(timestamp),
      destination.timezone ?? 'Europe/Dublin'
    );
    return format(zonedTime, 'HH:mm');
  };

  const formatDate = (timestamp: number) => {
    if (!destination?.timezone) return '';

    const zonedTime = toZonedTime(
      fromUnixTime(timestamp),
      destination.timezone ?? 'Europe/Dublin'
    );
    return format(zonedTime, 'EEE, MMM dd');
  };

  const getUVIndexLabel = (uvi: number) => {
    if (uvi <= 2)
      return { label: 'Low', color: 'bg-green-500 dark:bg-green-700' };
    if (uvi <= 5)
      return { label: 'Moderate', color: 'bg-yellow-500 dark:bg-yellow-600' };
    if (uvi <= 7)
      return { label: 'High', color: 'bg-orange-500 dark:bg-orange-600' };
    if (uvi <= 10)
      return { label: 'Very High', color: 'bg-red-500 dark:bg-red-600' };
    return { label: 'Extreme', color: 'bg-purple-500 dark:bg-purple-600' };
  };

  const getPrecipitationChance = (pop: number) => {
    return Math.round(pop * 100);
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4 max-w-6xl'>
        <div className='mb-6'>
          <Skeleton className='h-12 w-64 mb-2' />
          <Skeleton className='h-6 w-48' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Skeleton className='h-80 w-full' />
          <Skeleton className='h-80 w-full col-span-2' />
        </div>
        <div className='mt-6'>
          <Skeleton className='h-8 w-48 mb-4' />
          <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className='h-40 w-full'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-4 max-w-6xl'>
        <Card className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              Weather Data Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-red-600'>{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => window.location.reload()}
              className='flex items-center gap-2'
            >
              <RefreshCw className='h-4 w-4' /> Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      <div className='mb-6 relative'>
        <h1 className='text-3xl font-bold flex items-center gap-2'>
          <MapPin className='h-6 w-6 text-primary' />
          {location}
        </h1>
        <p className='text-muted-foreground dark:text-gray-400'>
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <Tabs
        defaultValue='overview'
        className='mb-6'
      >
        <TabsList className='mb-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='hourly'>Hourly Forecast</TabsTrigger>
          <TabsTrigger value='daily'>5-Day Forecast</TabsTrigger>
          <TabsTrigger value='details'>Weather Details</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Current Weather Card */}
            <Card className='md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800'>
              <CardHeader className='pb-2'>
                <CardTitle>Current Weather</CardTitle>
                <CardDescription>
                  {formatDate(weather.current.dt)}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center py-6'>
                <div className='mb-4'>
                  <Image
                    src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
                    alt={weather.current.weather[0].description}
                    width={100}
                    height={100}
                  />
                </div>
                <div className='text-6xl font-bold mb-2'>
                  {Math.round(weather.current.temp)}°C
                </div>
                <div className='text-xl capitalize mb-1'>
                  {weather.current.weather[0].description}
                </div>
                <div className='text-sm text-muted-foreground dark:text-gray-400 mb-4'>
                  Feels like {Math.round(weather.current.feels_like)}°C
                </div>
                <div className='flex gap-4 text-sm'>
                  <div className='flex items-center'>
                    <ArrowUp className='h-4 w-4 text-red-500 mr-1' />
                    {Math.round(weather.daily[0].temp.max)}°
                  </div>
                  <div className='flex items-center'>
                    <ArrowDown className='h-4 w-4 text-blue-500 mr-1' />
                    {Math.round(weather.daily[0].temp.min)}°
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Details Card */}
            <Card className='md:col-span-2'>
              <CardHeader className='pb-2'>
                <CardTitle>Weather Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  <div className='flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                    <Wind className='h-6 w-6 text-blue-500 mb-2' />
                    <div className='text-sm font-medium'>Wind Speed</div>
                    <div className='text-xl font-bold'>
                      {weather.current.wind_speed} m/s
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                    <Droplets className='h-6 w-6 text-blue-500 mb-2' />
                    <div className='text-sm font-medium'>Humidity</div>
                    <div className='text-xl font-bold'>
                      {weather.current.humidity}%
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                    <Thermometer className='h-6 w-6 text-blue-500 mb-2' />
                    <div className='text-sm font-medium'>Pressure</div>
                    <div className='text-xl font-bold'>
                      {weather.current.pressure} hPa
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center p-3 bg-orange-50 dark:bg-blue-900 rounded-lg'>
                    <Sunrise className='h-6 w-6 text-orange-500 mb-2' />
                    <div className='text-sm font-medium'>Sunrise</div>
                    <div className='text-xl font-bold'>
                      {formatTime(weather.current.sunrise)}
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-950 rounded-lg'>
                    <Sunset className='h-6 w-6 text-red-500 mb-2' />
                    <div className='text-sm font-medium'>Sunset</div>
                    <div className='text-xl font-bold'>
                      {formatTime(weather.current.sunset)}
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                    <Sun className='h-6 w-6 text-yellow-500 mb-2' />
                    <div className='text-sm font-medium'>UV Index</div>
                    <div className='flex items-center gap-2'>
                      <div className='text-xl font-bold'>
                        {Math.round(weather.current.uvi)}
                      </div>
                      <Badge
                        className={getUVIndexLabel(weather.current.uvi).color}
                      >
                        {getUVIndexLabel(weather.current.uvi).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Forecast Preview */}
          <Card className='mt-6'>
            <CardHeader className='pb-2'>
              <CardTitle>Today's Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='w-full whitespace-nowrap'>
                <div className='flex w-max space-x-4 p-1'>
                  {weather?.hourly?.slice(0, 12).map((hour, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center justify-center w-24 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'
                    >
                      <div className='text-sm font-medium'>
                        {index === 0 ? 'Now' : formatTime(hour.dt)}
                      </div>
                      <div className='my-2'>
                        <Image
                          src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                          alt={weather.current.weather[0].description}
                          width={50}
                          height={50}
                        />
                        {/* {getWeatherIcon(hour.weather[0].description, 6)} */}
                      </div>
                      <div className='text-lg font-bold'>
                        {Math.round(hour.temp)}°C
                      </div>
                      <div className='text-xs text-muted-foreground dark:text-gray-400 mt-1'>
                        {getPrecipitationChance(hour.pop)}%{' '}
                        <Droplets className='h-3 w-3 inline' />
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 5-Day Forecast Preview */}
          <Card className='mt-6'>
            <CardHeader className='pb-2'>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-5 gap-4'>
                {weather.daily.slice(1, 6).map((day, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'
                  >
                    <div className='text-sm font-medium mb-2'>
                      {formatDate(day.dt)}
                    </div>
                    <div className='mb-2'>
                      {/* {getWeatherIcon(day.weather[0].description, 8)} */}
                      <Image
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={weather.current.weather[0].description}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className='text-lg font-bold mb-1'>
                      {Math.round(day.temp.day)}°C
                    </div>
                    <div className='flex gap-2 text-xs'>
                      <span className='flex items-center'>
                        <ArrowUp className='h-3 w-3 text-red-500 mr-1' />
                        {Math.round(day.temp.max)}°
                      </span>
                      <span className='flex items-center'>
                        <ArrowDown className='h-3 w-3 text-blue-500 mr-1' />
                        {Math.round(day.temp.min)}°
                      </span>
                    </div>
                    <div className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                      {getPrecipitationChance(day.pop)}%{' '}
                      <Droplets className='h-3 w-3 inline' />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='hourly'>
          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
              <CardDescription>24-hour weather forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {weather.hourly.slice(0, 24).map((hour, index) => (
                  <div
                    key={index}
                    className='flex items-center p-3 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'
                  >
                    <div className='mr-3'>
                      {/* {getWeatherIcon(hour.weather[0].description, 10)} */}
                      <Image
                        src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                        alt={weather.current.weather[0].description}
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <div className='font-medium'>
                        {index === 0 ? 'Now' : formatTime(hour.dt)}
                      </div>
                      <div className='text-xl font-bold'>
                        {Math.round(hour.temp)}°C
                      </div>
                      <div className='text-sm capitalize'>
                        {hour.weather[0].description}
                      </div>
                      <div className='flex gap-3 text-sm mt-1'>
                        <span className='flex items-center'>
                          <Wind className='h-3 w-3 mr-1' />
                          {hour.wind_speed}m/s
                        </span>
                        <span className='flex items-center'>
                          <Droplets className='h-3 w-3 mr-1' />
                          {getPrecipitationChance(hour.pop)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='daily'>
          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>Extended weather forecast</CardDescription>
            </CardHeader>
            <CardContent>
              {weather?.daily?.slice(1, 6).map((day, index) => (
                <div
                  key={index}
                  className='mb-4 last:mb-0'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'>
                    <div className='flex items-center mb-3 sm:mb-0'>
                      <div className='mr-4'>
                        {/* {getWeatherIcon(day.weather[0].description, 12)} */}
                        <Image
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt={weather.current.weather[0].description}
                          width={70}
                          height={70}
                        />
                      </div>
                      <div>
                        <div className='font-medium text-lg'>
                          {formatDate(day.dt)}
                        </div>
                        <div className='text-sm capitalize'>
                          {day.weather[0].description}
                        </div>
                        <div className='text-sm text-muted-foreground dark:text-gray-400'>
                          {day.summary}
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 sm:mt-0'>
                      <div className='text-center'>
                        <div className='text-sm text-muted-foreground dark:text-gray-400'>
                          Day
                        </div>
                        <div className='text-xl font-bold'>
                          {Math.round(day.temp.day)}°C
                        </div>
                      </div>

                      <div className='text-center'>
                        <div className='text-sm text-muted-foreground dark:text-gray-400'>
                          Night
                        </div>
                        <div className='text-xl font-bold'>
                          {Math.round(day.temp.night)}°C
                        </div>
                      </div>

                      <div className='text-center'>
                        <div className='flex items-center justify-center text-sm text-muted-foreground dark:text-gray-400'>
                          <ArrowUp className='h-3 w-3 text-red-500 mr-1' /> Max
                        </div>
                        <div className='text-xl font-bold'>
                          {Math.round(day.temp.max)}°C
                        </div>
                      </div>

                      <div className='text-center'>
                        <div className='flex items-center justify-center text-sm text-muted-foreground dark:text-gray-400'>
                          <ArrowDown className='h-3 w-3 text-blue-500 mr-1' />{' '}
                          Min
                        </div>
                        <div className='text-xl font-bold'>
                          {Math.round(day.temp.min)}°C
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < 4 && <Separator className='my-4' />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='details'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Current Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Temperature
                    </span>
                    <span className='font-medium'>
                      {weather.current.temp}°C
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Feels Like
                    </span>
                    <span className='font-medium'>
                      {weather.current.feels_like}°C
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Weather
                    </span>
                    <span className='font-medium capitalize'>
                      {weather.current.weather[0].description}
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Humidity
                    </span>
                    <span className='font-medium'>
                      {weather.current.humidity}%
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Wind Speed
                    </span>
                    <span className='font-medium'>
                      {weather.current.wind_speed} m/s
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Wind Direction
                    </span>
                    <span className='font-medium'>
                      {weather.current.wind_deg}°
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Pressure
                    </span>
                    <span className='font-medium'>
                      {weather.current.pressure} hPa
                    </span>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      UV Index
                    </span>
                    <div className='flex items-center'>
                      <span className='font-medium mr-2'>
                        {weather.current.uvi}
                      </span>
                      <Badge
                        className={getUVIndexLabel(weather.current.uvi).color}
                      >
                        {getUVIndexLabel(weather.current.uvi).label}
                      </Badge>
                    </div>
                  </div>
                  <Separator />

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground dark:text-gray-400'>
                      Visibility
                    </span>
                    <span className='font-medium'>
                      {(weather.current.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sun & Moon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-medium mb-3'>Sun</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex flex-col items-center p-3 bg-orange-50 dark:bg-blue-900 rounded-lg'>
                        <Sunrise className='h-6 w-6 text-orange-500 mb-2' />
                        <div className='text-sm font-medium'>Sunrise</div>
                        <div className='text-lg font-bold'>
                          {formatTime(weather.current.sunrise)}
                        </div>
                      </div>

                      <div className='flex flex-col items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg'>
                        <Sunset className='h-6 w-6 text-red-500 mb-2' />
                        <div className='text-sm font-medium'>Sunset</div>
                        <div className='text-lg font-bold'>
                          {formatTime(weather.current.sunset)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='text-lg font-medium mb-3'>Moon</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                        <Clock className='h-6 w-6 text-blue-500 mb-2' />
                        <div className='text-sm font-medium'>Moonrise</div>
                        <div className='text-lg font-bold'>
                          {formatTime(weather.daily[0].moonrise)}
                        </div>
                      </div>

                      <div className='flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                        <Clock className='h-6 w-6 text-blue-500 mb-2' />
                        <div className='text-sm font-medium'>Moonset</div>
                        <div className='text-lg font-bold'>
                          {formatTime(weather.daily[0].moonset)}
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center'>
                      <div className='text-sm font-medium mb-1'>Moon Phase</div>
                      <div className='text-lg font-bold'>
                        {(() => {
                          const phase = weather.daily[0].moon_phase;
                          if (phase === 0 || phase === 1) return 'New Moon';
                          if (phase < 0.25) return 'Waxing Crescent';
                          if (phase === 0.25) return 'First Quarter';
                          if (phase < 0.5) return 'Waxing Gibbous';
                          if (phase === 0.5) return 'Full Moon';
                          if (phase < 0.75) return 'Waning Gibbous';
                          if (phase === 0.75) return 'Last Quarter';
                          return 'Waning Crescent';
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
