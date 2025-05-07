import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

export interface localGuideResponse {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  officialwebsite: string;
  phone: string;
}
const localGuide = [
  {
    name: 'Abbey Travel',
    type: 'Travel Agent',
    description:
      'Abbey Travel is a fully licensed and bonded Irish-owned travel agency with over 40 years of experience. They offer a wide range of travel services, including package holidays, cruises, sports packages, and city breaks.',
    address: '43-45 Middle Abbey Street, Dublin 1, Ireland',
    latitude: 53.3488,
    longitude: -6.2603,
    officialwebsite: 'https://www.abbeytravel.ie',
    phone: '+353 1 804 7100',
  },
  {
    name: 'Cassidy Travel',
    type: 'Travel Agent',
    description:
      "Cassidy Travel is one of Ireland's leading travel agents, offering a comprehensive range of travel services, including sun holidays, city breaks, cruises, and sports travel.",
    address: "Unit 9, St. Stephen's Green Centre, Dublin 2, Ireland",
    latitude: 53.3382,
    longitude: -6.2624,
    officialwebsite: 'https://www.cassidytravel.ie',
    phone: '+353 1 677 1111',
  },
  {
    name: 'Travel Department',
    type: 'Travel Agent',
    description:
      'Travel Department is a leading provider of guided group holidays, offering a wide range of destinations and holiday types, including city breaks, cultural tours, and river cruises.',
    address: 'Harmony Court, Harmony Row, Dublin 2, Ireland',
    latitude: 53.344,
    longitude: -6.2488,
    officialwebsite: 'https://www.traveldepartment.com',
    phone: '+353 1 637 1600',
  },
  {
    name: 'Tour America',
    type: 'Travel Agent',
    description:
      'Tour America specializes in holidays to the USA, Canada, Mexico, and the Caribbean, offering a range of packages, including cruises, city breaks, and escorted tours.',
    address: '62/63 Middle Abbey Street, Dublin 1, Ireland',
    latitude: 53.3485,
    longitude: -6.2597,
    officialwebsite: 'https://www.touramerica.ie',
    phone: '+353 1 817 3535',
  },
  {
    name: 'The Travel Broker',
    type: 'Travel Agent',
    description:
      'The Travel Broker is a fully licensed and bonded travel agency offering a wide range of travel services, including package holidays, cruises, and corporate travel solutions.',
    address: '11 Vernon Avenue, Clontarf, Dublin 3, Ireland',
    latitude: 53.3656,
    longitude: -6.2118,
    officialwebsite: 'https://www.travelbroker.ie',
    phone: '+353 1 833 3921',
  },
  {
    name: 'Skytours',
    type: 'Travel Agent',
    description:
      'Skytours is a Dublin-based travel agency offering a wide range of travel services, including package holidays, flights, and cruises.',
    address: '107-109 Talbot Street, Dublin 1, Ireland',
    latitude: 53.3503,
    longitude: -6.2546,
    officialwebsite: 'https://www.skytours.ie',
    phone: '+353 1 878 0800',
  },
  {
    name: 'Dublin Tour Guide',
    type: 'Tour Guide',
    description:
      "Dublin Tour Guide offers private walking tours tailored to your interests, providing an in-depth exploration of Dublin's history, culture, and landmarks.",
    address: 'Dublin, Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
    officialwebsite: 'https://www.dublintourguide.ie',
    phone: '+353 86 304 4433',
  },
  {
    name: 'ToursByLocals - Janine H.',
    type: 'Tour Guide',
    description:
      "Janine H. offers private walking tours in Dublin, focusing on the city's highlights and lesser-known stories, providing a personalized experience.",
    address: 'Dublin, Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
    officialwebsite: 'https://www.toursbylocals.com/Dublin-Tour-Guide-Janine',
    phone: '+353 87 123 4567',
  },
  {
    name: 'ToursByLocals - Garvan R.',
    type: 'Tour Guide',
    description:
      "Garvan R. provides private tours covering Dublin's major attractions and hidden gems, offering insights into the city's history and culture.",
    address: 'Dublin, Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
    officialwebsite: 'https://www.toursbylocals.com/Dublin-Tour-Guide-Garvan',
    phone: '+353 87 234 5678',
  },
  {
    name: 'ToursByLocals - Fergal B.',
    type: 'Tour Guide',
    description:
      "Fergal B. offers private walking tours that delve into Dublin's past and present, exploring its architecture, history, and local stories.",
    address: 'Dublin, Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
    officialwebsite: 'https://www.toursbylocals.com/Dublin-Tour-Guide-Fergal',
    phone: '+353 87 345 6789',
  },
];

const apiKey = 'AIzaSyC3NWbJrwjeTk5Gq98u2VvlOwy0edMKtXQ';

if (!apiKey) {
  throw new Error('Google API key is not set');
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: 'user',
      parts: [
        {
          text: `Generate a JSON response with details for the local guides in destination {in the Ireland Dublin}. Include the following details:
            
        Atleast 10 local guides with the following details:
        For each destination, include:
        - name
        - type
        - description
        - address
        - latitude
        - longitude
        - official website
        - phone
        Provide the response in JSON format`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: JSON.stringify(localGuide, null, 2),
        },
      ],
    },
  ],
});

export async function generateLocalGuides(destination: string): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let prompt = `Generate a JSON response with details for the local guides in destination ${destination}. Include the following details:
            
        Atleast 2 local guides with the following details:
        For each destination, include:
        - name
        - type
        - description
        - address
        - latitude
        - longitude
        - official website
        - phone
        Provide the response in JSON format`;

  const response = await chatSession.sendMessage(prompt);
  if (response) {
    const text = await response.response.text();

    try {
      const parsedText = JSON.parse(text);
      console.log('hhhhhhhhhhh------------>', parsedText, text);
      const data = parsedText.map((place: any) => {
        const lowercasePlace: { [key: string]: any } = {};
        Object.keys(place).forEach((key) => {
          lowercasePlace[key.toLowerCase()] = place[key];
        });
        return {
          ...lowercasePlace,
        };
      });
      return data;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  }

  return localGuide;
}
