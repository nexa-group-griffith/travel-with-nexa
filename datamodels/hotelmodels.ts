export interface HotelResponse {
  name?: string;
  address?: string;
  location_id?: string;
  location_string?: string;
  latitude?: string;
  longitude?: string;
  rating?: string;
  ranking?: string;
  num_reviews?: string;
  category?: {
    key?: string;
    name?: string;
  };
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  web_url?: string;
  photo?: {
    images?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
      thumbnail?: { url?: string };
    };
    caption?: string;
  };
  price?: string;
  open_now_text?: string;
  hours?: {
    timezone?: string;
    week_ranges?: Array<{ open_time?: number; close_time?: number }[]>;
  };
}

export const hotelKeys: Array<keyof HotelResponse> = [
  'name',
  'address',
  'location_id',
  'location_string',
  'latitude',
  'longitude',
  'rating',
  'ranking',
  'num_reviews',
  'category',
  'description',
  'email',
  'phone',
  'website',
  'web_url',
  'photo',
  'price',
  'open_now_text',
  'hours',
];

console.log(hotelKeys);
