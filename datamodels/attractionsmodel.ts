interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  postalcode?: string;
}

interface Booking {
  provider: string;
  url: string;
}

interface Category {
  key: string;
  name: string;
}

interface Offer {
  url: string;
  price: string;
  rounded_up_price: string;
  offer_type: string;
  title: string;
  partner: string;
  image_url?: string;
  product_code?: string;
}

interface Photo {
  caption: string;
  helpful_votes: string;
  id: string;
  images: {
    large: { width: string; url: string; height: string };
    medium: { width: string; url: string; height: string };
    original: { width: string; url: string; height: string };
    small: { width: string; url: string; height: string };
    thumbnail: { width: string; url: string; height: string };
  };
  published_date: string;
  uploaded_date: string;
}

export interface AttractionResponse {
  address: string;
  address_obj: Address;
  bearing: string;
  booking: Booking;
  category: Category;
  description: string;
  distance: string;
  distance_string: string;
  doubleclick_zone: string;
  email?: string;
  fee?: string;
  is_closed: boolean;
  is_long_closed: boolean;
  latitude: string;
  location_id: string;
  location_string: string;
  longitude: string;
  name: string;
  num_reviews: string;
  open_now_text?: string;
  parent_display_name: string;
  phone?: string;
  photo?: Photo;
  ranking: string;
  ranking_category: string;
  ranking_denominator: string;
  ranking_geo: string;
  ranking_geo_id: string;
  ranking_position: string;
  rating: string;
  raw_ranking: string;
  subcategory_ranking?: string;
  timezone: string;
  web_url: string;
  website?: string;
  write_review?: string;
}

export const attractionKeys: Array<keyof AttractionResponse> = [
  'address',
  'address_obj',
  'bearing',
  'booking',
  'category',
  'description',
  'distance',
  'distance_string',
  'doubleclick_zone',
  'email',
  'fee',
  'is_closed',
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
  'ranking',
  'ranking_category',
  'ranking_denominator',
  'ranking_geo',
  'ranking_geo_id',
  'ranking_position',
  'rating',
  'raw_ranking',
  'subcategory_ranking',
  'timezone',
  'web_url',
  'website',
  'write_review',
];
