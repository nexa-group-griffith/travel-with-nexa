interface Address {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface Category {
  key: string;
  name: string;
}

interface Cuisine {
  key?: string;
  name?: string;
}

interface DietaryRestriction {
  key?: string;
  name?: string;
}

interface Hours {
  week_ranges?: Array<Array<{ open_time?: number; close_time?: number }>>;
  timezone?: string;
}

interface Photo {
  images: {
    large?: { width: string; url: string; height: string };
    medium?: { width: string; url: string; height: string };
    original?: { width: string; url: string; height: string };
    small?: { width: string; url: string; height: string };
    thumbnail?: { width: string; url: string; height: string };
  };
  is_blessed?: boolean;
  uploaded_date?: string;
  caption?: string;
  id?: string;
}

export interface RestaurantResponse {
  address?: string;
  address_obj?: Address;
  bearing?: string;
  category: Category;
  description?: string;
  distance?: string;
  distance_string?: string;
  doubleclick_zone?: string;
  is_candidate_for_contact_info_suppression?: boolean;
  is_closed?: boolean;
  is_jfy_enabled?: boolean;
  is_long_closed?: boolean;
  latitude: string;
  location_id: string;
  location_string?: string;
  longitude: string;
  name: string;
  num_reviews?: string;
  open_now_text?: string;
  parent_display_name?: string;
  phone?: string;
  photo?: Photo;
  preferred_map_engine?: string;
  price?: string;
  price_level?: string;
  ranking?: string;
  ranking_category?: string;
  ranking_denominator?: string;
  ranking_geo?: string;
  ranking_geo_id?: string;
  ranking_position?: string;
  rating?: string;
  raw_ranking?: string;
  timezone?: string;
  web_url?: string;
  website?: string;
  write_review?: string;
}

export const restaurantKeys: Array<keyof RestaurantResponse> = [
  'address',
  'address_obj',
  'bearing',
  'category',
  'description',
  'distance',
  'distance_string',
  'doubleclick_zone',
  'is_candidate_for_contact_info_suppression',
  'is_closed',
  'is_jfy_enabled',
  'is_long_closed',
  'latitude',
  'location_id',
  'location_string',
  'longitude',
  'name',
  'num_reviews',
  'open_now_text',
  'parent_display_name',
  'phone',
  'photo',
  'preferred_map_engine',
  'price',
  'price_level',
  'ranking',
  'ranking_category',
  'ranking_denominator',
  'ranking_geo',
  'ranking_geo_id',
  'ranking_position',
  'rating',
  'raw_ranking',
  'timezone',
  'web_url',
  'website',
  'write_review',
];
