"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { TripDetailsResponse } from "@/datamodels/tripmodels"

export default function TripsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [trips, setTrips] = useState<TripDetailsResponse[]>([])
  const [pastTrips, setPastTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/trips")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user || !db) return

      try {
        const tripsRef = collection(doc(db, "users", user.uid), "trips")
        const querySnapshot = await getDocs(tripsRef)

        const trips: any[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const currentDate = new Date()
        const currentTrips: any[] = []
        const completedTrips: any[] = []

        trips.forEach((doc) => {
          const endDate = new Date(doc?.dates?.end)
          if (endDate < currentDate) {
            completedTrips.push(doc)
          } else {
            currentTrips.push(doc)
          }
        })

        setTrips(currentTrips)
        setPastTrips(completedTrips)
      } catch (error: any) {
        console.error("Error fetching trips:", error)
        setError(error.message || "Failed to load trips")
      } finally {
        setLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchTrips()
    }
  }, [user, authLoading, db])

  if (authLoading || loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <p className="text-muted-foreground">Manage your upcoming and past trips</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild className="flex-1">
          <Link href="/plan-trip">
            <Plus className="mr-2 h-4 w-4" />
            Plan a New Trip
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/destinations">
            <MapPin className="mr-2 h-4 w-4" />
            Explore Destinations
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Your Upcoming Trips</CardTitle>
              <CardDescription>Trips you have planned</CardDescription>
            </CardHeader>
            <CardContent>
              {trips.length > 0 ? (
                <div className="space-y-6">
                  {trips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 sm:w-2/3">
                          <h3 className="text-xl font-semibold">Trip to {trip?.placesDetails?.name}</h3>
                          <div className="mb-2 flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(trip.dates.start).toLocaleDateString()} -{" "}
                            {new Date(trip.dates.end).toLocaleDateString()} ({trip.dates.days} days)
                          </div>
                          <p className="mb-4 text-sm text-muted-foreground">{trip?.overview ?? ""}</p>
                          <Button asChild>
                            <Link href={`/destinations/${trip.id}`}>View Trip Details</Link>
                          </Button>
                        </div>
                        <div className="relative h-40 sm:h-auto sm:w-1/3">
                          <Image
                            src={trip?.placesDetails?.photos?.[4] ?? "/placeholder.webp?height=200&width=300"}
                            alt={trip?.placesDetails?.name ?? "Attraction"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No trips planned yet</h3>
                  <p className="mb-4 text-muted-foreground">Start planning your next adventure</p>
                  <Button asChild>
                    <Link href="/plan-trip">Plan a Trip</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Your Past Trips</CardTitle>
              <CardDescription>Trips you have completed</CardDescription>
            </CardHeader>
            <CardContent>
              {pastTrips.length > 0 ? (
                <div className="space-y-6">
                  {pastTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 sm:w-2/3">
                          <h3 className="text-xl font-semibold">Trip to {trip.destination.name}</h3>
                          <div className="mb-2 flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(trip.dates.start).toLocaleDateString()} -{" "}
                            {new Date(trip.dates.end).toLocaleDateString()} ({trip.dates.days} days)
                          </div>
                          <p className="mb-4 text-sm text-muted-foreground">{trip.itinerary.overview}</p>
                          <Button asChild>
                            <Link href={`/trips/${trip.id}`}>View Trip Details</Link>
                          </Button>
                        </div>
                        <div className="relative h-40 sm:h-auto sm:w-1/3">
                          <Image
                            src="/placeholder.webp?height=200&width=300"
                            alt={trip.destination.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No past trips</h3>
                  <p className="mb-4 text-muted-foreground">Your completed trips will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
