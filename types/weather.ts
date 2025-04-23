export interface WeatherRequest {
  lat: number
  lon: number
  units?: "metric" | "imperial"
}

export interface WeatherResponse {
  success: boolean
  message?: string
  data?: WeatherData
}

export interface WeatherData {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: CurrentWeather
  minutely?: MinuteForecast[]
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

export interface CurrentWeather {
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
  wind_gust?: number
  weather: Weather[]
  rain?: {
    "1h"?: number
  }
  snow?: {
    "1h"?: number
  }
}

export interface MinuteForecast {
  dt: number
  precipitation: number
}

export interface HourlyForecast {
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
  wind_gust?: number
  weather: Weather[]
  pop: number
  rain?: {
    "1h"?: number
  }
  snow?: {
    "1h"?: number
  }
}

export interface DailyForecast {
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
  wind_gust?: number
  weather: Weather[]
  clouds: number
  pop: number
  rain?: number
  snow?: number
  uvi: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface TemperatureRange {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}
