export const getTimezoneWithCoordinates = async (lat: number, lng: number) => {
  const timestamp = new Date().getTime() / 1000
  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.status === "OK") {
    return data.timeZoneId
  } else {
    throw new Error("Failed to fetch timezone")
  }
}
