import { apiClient } from "./api-client"
import type {
  WishlistResponse,
  AddToWishlistRequest,
  AddToWishlistResponse,
  RemoveFromWishlistResponse,
  WishlistItem,
} from "@/types/wishlist"

export const wishlistService = {
  getWishlist: async (): Promise<WishlistResponse> => {
    try {
      return await apiClient.get<WishlistResponse>("/api/wishlist")
    } catch (error) {
      console.error("Get wishlist error:", error)
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch wishlist",
        items: [],
      }
    }
  },

  addToWishlist: async (data: AddToWishlistRequest): Promise<AddToWishlistResponse> => {
    try {
      return await apiClient.post<AddToWishlistResponse>("/api/wishlist", data)
    } catch (error) {
      console.error("Add to wishlist error:", error)
      return {
        success: false,
        message: (error as Error).message || "Failed to add item to wishlist",
        item: {} as WishlistItem,
      }
    }
  },

  removeFromWishlist: async (itemId: string): Promise<RemoveFromWishlistResponse> => {
    try {
      return await apiClient.delete<RemoveFromWishlistResponse>(`/api/wishlist/${itemId}`)
    } catch (error) {
      console.error("Remove from wishlist error:", error)
      return {
        success: false,
        message: (error as Error).message || "Failed to remove item from wishlist",
      }
    }
  },
}
