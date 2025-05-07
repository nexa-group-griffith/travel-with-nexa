export interface HotelResponse {
  id?: string;
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
      small?: { url?: string; width?: string; height?: string };
      medium?: { url?: string; width?: string; height?: string };
      large?: { url?: string; width?: string; height?: string };
      original?: { url?: string; width?: string; height?: string };
      thumbnail?: { url?: string; width?: string; height?: string };
    };
    caption?: string;
  };
  price?: string;
  open_now_text?: string;
  hours?: {
    timezone?: string;
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
