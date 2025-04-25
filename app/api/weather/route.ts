import { type NextRequest, NextResponse } from "next/server"
import type { WeatherResponse, WeatherData } from "@/types/weather"

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall"

export async function GET(request: NextRequest): Promise<NextResponse<WeatherResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const units = searchParams.get("units") || "metric"

    if (!lat || !lon) {
      return NextResponse.json({ success: false, message: "Latitude and longitude are required" }, { status: 400 })
    }

    if (!WEATHER_API_KEY) {
      return NextResponse.json({ success: false, message: "Weather API key is not configured" }, { status: 500 })
    }

    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const data: WeatherData = await response.json()

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch weather data" },
      { status: 500 },
    )
  }
}
