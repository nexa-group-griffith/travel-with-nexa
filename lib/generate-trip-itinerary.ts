import { GoogleGenerativeAI } from '@google/generative-ai';
export interface TripParams {
  destination: string;
  days: number;
  travelers: number;
  budget: string;
  interests: string[];
}

const travelPlan = {
  transportation: [
    {
      type: 'public',
      name: 'Delhi Metro',
      description:
        'A rapid transit system in Delhi providing an efficient and affordable mode of transportation.',
    },
    {
      type: 'private',
      name: 'Auto Rickshaws',
      description:
        'Small, three-wheeled vehicles ideal for short trips within the city.',
    },
    {
      type: 'private',
      name: 'Taxis',
      description:
        'Convenient for longer trips, taxis are widely available across Delhi.',
    },
    {
      type: 'public',
      name: 'Buses',
      description:
        'Delhi has an extensive bus network that covers most areas of the city, offering an affordable travel option.',
    },
    {
      type: 'foot',
      name: 'Walking',
      description:
        'Walking is a great way to explore Delhi’s historical and cultural sites, especially in congested areas.',
    },
  ],
  reviews: [
    {
      rating: 4.5,
      review: 'Delhi is a vibrant city with a rich history and culture.',
      reviewer: 'John Doe',
    },
    {
      rating: 4.8,
      review:
        'Delhi is a bustling city with a diverse culture and rich heritage.',
      reviewer: 'Jane Smith',
    },
    {
      rating: 4.2,
      review: 'Delhi is a vibrant city with a rich history and culture.',
      reviewer: 'Robert Brown',
    },
  ],
  securityAlerts: [
    {
      type: 'travel',
      title: 'Demonstrations',
      description: 'Demonstrations expected in central Delhi on Saturday.',
      severity: 'medium',
    },
    {
      type: 'health',
      title: 'Covid-19',
      description:
        'Covid-19 cases expected to rise in central Delhi in the coming days.',
      severity: 'high',
    },
  ],
  fraudAlerts: [
    {
      type: 'fraud',
      title: 'Taxi Scams',
      description:
        'Beware of taxis charging higher fares, especially for tourists. Always use a metered taxi.',
      severity: 'high',
    },
  ],
  currency: 'Indian Rupee',
  currencyCode: 'INR',
  currencySymbol: '₹',
  currencyExchangeRate: '1 USD = 75 INR',
  languages: ['Hindi', 'English'],
  rating: 4.9,
};

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

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: 'user',
      parts: [
        {
          text: 'Generate a detailed for Delhi, India. Include the following details:\n\n1.list of  Reviews(rating, review, reviewer).\n2. Security alerts (type, title, description, severity).\n4. fraudAlerts (type, title, description, severity).\n5 Currency, \n6Currency Code, \n7Currency Symbol, \n8Currency Exchange Rate, \n9.Transportation Options(type,name,description), \n10.  list of Language and rating.\n\nProvide the details only for the above properties in JSON format.',
        },
      ],
    },

    {
      role: 'model',
      parts: [
        {
          text: JSON.stringify(travelPlan),
        },
      ],
    },
  ],
});

export async function generateTripItinerary(params: TripParams): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { destination, days, budget, interests, travelers } = params;

  let prompt = `Generate a detailed for ${destination}. Include the following details:\n\n1.list of Atleast 10 Reviews (rating, review, reviewer).\n2.list ofAtleast 10  Security alerts (type, title, description, severity).\n4. list of Atleast 10 fraudAlerts (type, title, description, severity).\n5 Currency, \n6Currency Code, \n7Currency Symbol, \n8Currency Exchange Rate, \n9. list of Atleast 5 Transportation Options(type,name,description), \n10.  list of Language and rating.\n\nProvide the details only for the above properties in JSON format.',
`;

  const response = await chatSession.sendMessage(prompt);
  if (response) {
    const text = await response.response.text();
    const cleanedText = text.trim();
    console.log(cleanedText);

    try {
      const parsedText = JSON.parse(cleanedText ?? '{}');
      const data = {
        overview: `Your ${days}-day trip to ${destination},  with a ${budget} budget, focusing on ${interests.join(
          ', '
        )}.`,
        ...parsedText,
      };
      return data;
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError);
    }
  }

  return null;
}
