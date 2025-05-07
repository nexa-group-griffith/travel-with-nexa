/**
 * Interface representing an item in the user's wishlist.
 * This can be a destination, hotel, restaurant or attraction.
 */
export interface WishlistItem {
  /** Unique identifier for the wishlist item */
  id: string;

  /** Type of the wishlist item */
  type: 'destination' | 'hotel' | 'restaurant' | 'attraction';

  /** Name of the place/item */
  name: string;

  /** Country where the item is located */
  country: string;

  /** City where the item is located (optional) */
  city?: string;

  /** URL or path to the item's image */
  image: string;

  /** Description of the place/item */
  description: string;

  /** ISO timestamp when the item was added to wishlist */
  addedAt: string;

  /** Geographical coordinates for mapping (optional) */
  coordinates?: {
    lat: number;
    lng: number;
  };

  /** Tags or categories associated with the item (optional) */
  tags?: string[];

  /** Rating of the place (optional) */
  rating?: number;

  /** Price level or range (optional) */
  price?: string;

  /** Address of the place (optional) */
  address?: string;

  /** Website URL (optional) */
  website?: string;

  /** Phone number (optional) */
  phone?: string;

  /** Opening hours (optional) */
  openingHours?: string;

  /** Available amenities for hotels (optional) */
  amenities?: string[];

  /** Cuisine type for restaurants (optional) */
  cuisine?: string;

  /** Best time to visit for attractions/destinations (optional) */
  bestTimeToVisit?: string;

  /** Estimated visit duration for attractions (optional) */
  estimatedDuration?: string;
}

/**
 * Response format for wishlist related API requests
 */
export interface WishlistResponse {
  success: boolean;
  message?: string;
  items?: WishlistItem[];
}

/**
 * Request format for adding items to wishlist
 */
export interface AddToWishlistRequest {
  itemId: string;
  itemType: 'destination' | 'hotel' | 'restaurant' | 'attraction';
  item: Omit<WishlistItem, 'type' | 'addedAt'>;
}

/**
 * Response format for adding items to wishlist
 */
export interface AddToWishlistResponse {
  success: boolean;
  message?: string;
  item?: WishlistItem;
}

/**
 * Response format for removing items from wishlist
 */
export interface RemoveFromWishlistResponse {
  success: boolean;
  message?: string;
}
