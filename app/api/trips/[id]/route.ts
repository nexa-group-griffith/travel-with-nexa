import { type NextRequest, NextResponse } from "next/server"
import type { TripResponse, TripUpdateResponse, TripDeleteResponse, Trip } from "@/types/trips"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getCurrentUser } from "@/lib/auth-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<TripResponse>> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized", trip: {} as Trip }, { status: 401 })
    }

    const tripId = params.id
    const tripDoc = await getDoc(doc(db, "users", user.uid, "trips", tripId))

    if (!tripDoc.exists()) {
      return NextResponse.json({ success: false, message: "Trip not found", trip: {} as Trip }, { status: 404 })
    }

    const trip = { id: tripDoc.id, ...tripDoc.data() } as Trip

    return NextResponse.json({
      success: true,
      trip,
    })
  } catch (error: any) {
    console.error("Get trip error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch trip", trip: {} as Trip },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<TripUpdateResponse>> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized", trip: {} as Trip }, { status: 401 })
    }

    const tripId = params.id
    const tripDoc = await getDoc(doc(db, "users", user.uid, "trips", tripId))

    if (!tripDoc.exists()) {
      return NextResponse.json({ success: false, message: "Trip not found", trip: {} as Trip }, { status: 404 })
    }

    const updateData = await request.json()

    // Update trip document
    await updateDoc(doc(db, "users", user.uid, "trips", tripId), {
      ...updateData,
      updatedAt: new Date().toISOString(),
    })

    // Get updated trip
    const updatedTripDoc = await getDoc(doc(db, "users", user.uid, "trips", tripId))
    const updatedTrip = { id: updatedTripDoc.id, ...updatedTripDoc.data() } as Trip

    return NextResponse.json({
      success: true,
      trip: updatedTrip,
    })
  } catch (error: any) {
    console.error("Update trip error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update trip", trip: {} as Trip },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<TripDeleteResponse>> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const tripId = params.id
    const tripDoc = await getDoc(doc(db, "users", user.uid, "trips", tripId))

    if (!tripDoc.exists()) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 })
    }

    // Delete trip document
    await deleteDoc(doc(db, "users", user.uid, "trips", tripId))

    return NextResponse.json({
      success: true,
      message: "Trip deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete trip error:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete trip" }, { status: 500 })
  }
}
