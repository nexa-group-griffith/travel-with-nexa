import { type NextRequest, NextResponse } from "next/server"
import type { WeatherResponse } from "@/types/weather"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<WeatherResponse>> {
  try {
    const destinationId = params.id
    const { searchParams } = new URL(request.url)
    const units = searchParams.get("units") || "metric"

    // Get destination coordinates from Firestore
    const destinationDoc = await getDoc(doc(db, "destinations", destinationId))

    if (!destinationDoc.exists()) {
      return NextResponse.json({ success: false, message: "Destination not found" }, { status: 404 })
    }

    const destination = destinationDoc.data()

    if (!destination.coordinates || !destination.coordinates.lat || !destination.coordinates.lng) {
      return NextResponse.json({ success: false, message: "Destination coordinates not available" }, { status: 400 })
    }

    if (!WEATHER_API_KEY) {
      return NextResponse.json({ success: false, message: "Weather API key is not configured" }, { status: 500 })
    }

    const response = await fetch(
      `${WEATHER_API_URL}?lat=${destination.coordinates.lat}&lon=${destination.coordinates.lng}&appid=${WEATHER_API_KEY}&units=${units}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

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
