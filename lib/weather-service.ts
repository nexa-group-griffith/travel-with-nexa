import { apiClient } from "./api-client"
import type { WeatherRequest, WeatherResponse } from "@/types/weather"

export const weatherService = {
  getWeather: async (params: WeatherRequest): Promise<WeatherResponse> => {
    try {
      const { lat, lon, units = "metric" } = params
      return await apiClient.get<WeatherResponse>(`/api/weather?lat=${lat}&lon=${lon}&units=${units}`)
    } catch (error) {
      console.error("Get weather error:", error)
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch weather data",
      }
    }
  },

  getWeatherByDestination: async (
    destinationId: string,
    units: "metric" | "imperial" = "metric",
  ): Promise<WeatherResponse> => {
    try {
      return await apiClient.get<WeatherResponse>(`/api/weather/destination/${destinationId}?units=${units}`)
    } catch (error) {
      console.error("Get weather by destination error:", error)
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch weather data for destination",
      }
    }
  },
}
