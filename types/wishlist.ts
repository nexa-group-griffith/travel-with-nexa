export interface WishlistItem {
  id: string
  name: string
  country: string
  city?: string
  image: string
  description: string
  addedAt: string
  coordinates?: {
    lat: number
    lng: number
  }
  tags?: string[]
}

export interface WishlistResponse {
  success: boolean
  message?: string
  items?: WishlistItem[]
}

export interface AddToWishlistRequest {
  destinationId: string
}

export interface AddToWishlistResponse {
  success: boolean
  message?: string
  item?: WishlistItem
}

export interface RemoveFromWishlistRequest {
  itemId: string
}

export interface RemoveFromWishlistResponse {
  success: boolean
  message?: string
}
