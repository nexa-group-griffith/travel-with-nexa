import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

export function getCurrentCountryAndLocation(): Promise<{
  country: string;
  location: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const location = timeZone.replace("_", " ");

        const regionCode = navigator.language.split("-")[1] || "Unknown";
        const country =
          new Intl.DisplayNames(["en"], { type: "region" }).of(regionCode) ||
          "Unknown";

        resolve({ country, location });
      },
      (error) => {
        reject(`Geolocation error: ${error.message}`);
      },
    );
  });
}

const modelResponse = [
  {
    name: "Paris",
    country: "France",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A global center for art, fashion, gastronomy, and culture, known for iconic landmarks like the Eiffel Tower and the Louvre Museum.",
    rating: 4.8,
    tags: ["City Break", "Romance", "Culture"],
    budget: "Budget Friendly",
  },
  {
    name: "London",
    country: "England",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A historic city with iconic landmarks like Buckingham Palace, the Tower of London, and the Houses of Parliament.",
    rating: 4.7,
    tags: ["History", "Culture", "City Break"],
    budget: "Luxury",
  },
  {
    name: "Rome",
    country: "Italy",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A city steeped in history and art, home to the Colosseum, the Roman Forum, and Vatican City.",
    rating: 4.9,
    tags: ["History", "Art", "Culture"],
    budget: "Luxury",
  },
  {
    name: "New York City",
    country: "USA",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A vibrant metropolis known for its iconic skyline, diverse cultures, and bustling energy.",
    rating: 4.6,
    tags: ["City Break", "Culture", "Food"],
    budget: "Budget Friendly",
  },
  {
    name: "Tokyo",
    country: "Japan",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A futuristic city with ancient traditions, known for its vibrant nightlife, delicious food, and modern architecture.",
    rating: 4.7,
    tags: ["City Break", "Modern", "Culture"],
    budget: "Luxury",
  },
  {
    name: "Barcelona",
    country: "Spain",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A coastal city known for its stunning architecture by Antoni Gaudí, vibrant nightlife, and beautiful beaches.",
    rating: 4.8,
    tags: ["Beaches", "Architecture", "Nightlife"],
    budget: "Mid-Range",
  },
  {
    name: "Sydney",
    country: "Australia",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A vibrant coastal city known for its iconic Opera House, Harbour Bridge, and stunning beaches like Bondi Beach.",
    rating: 4.9,
    tags: ["Beaches", "City Break", "Nature"],
    budget: "Luxury",
  },
  {
    name: "Dubai",
    country: "UAE",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A city of extravagance known for its modern architecture, luxury shopping, and vibrant nightlife.",
    rating: 4.6,
    tags: ["Luxury", "Modern", "Shopping"],
    budget: "Luxury",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A beautiful city nestled between mountains and the sea, known for Table Mountain, stunning beaches, and diverse culture.",
    rating: 4.7,
    tags: ["Nature", "Beaches", "Adventure"],
    budget: "Budget Friendly",
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A vibrant city known for its beaches, Christ the Redeemer statue, and Sugarloaf Mountain.",
    rating: 4.8,
    tags: ["Beaches", "Nature", "Culture"],
    budget: "mid Range",
  },
  {
    name: "Marrakech",
    country: "Morocco",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A bustling city with a rich history and culture, known for its souks (markets), palaces, and vibrant atmosphere.",
    rating: 4.6,
    tags: ["Culture", "History", "Markets"],
    budget: "Budget Friendly",
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A charming city known for its canals, bicycles, and liberal atmosphere.",
    rating: 4.7,
    tags: ["Canals", "City Break", "Culture"],
    budget: "Mid Range",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A city bridging Europe and Asia, known for its rich history, stunning architecture, and delicious food.",
    rating: 4.8,
    tags: ["History", "Culture", "Food"],
    budget: "Mid Range",
  },
  {
    name: "Honolulu",
    country: "USA",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A tropical paradise known for its beautiful beaches, stunning scenery, and laid-back atmosphere.",
    rating: 4.9,
    tags: ["Beaches", "Relaxation", "Nature"],
    budget: "High End",
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A charming city known for its stunning natural beauty, geothermal hot springs, and Northern Lights (Aurora Borealis).",
    rating: 4.7,
    tags: ["Nature", "Adventure", "Northern Lights"],
    budget: "Mid Range",
  },
  {
    name: "Vancouver",
    country: "Canada",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A beautiful city surrounded by mountains and the sea, known for its stunning natural beauty, diverse culture, and vibrant food scene.",
    rating: 4.8,
    tags: ["Nature", "City Break", "Food"],
    budget: "Budget Friendly",
  },
  {
    name: "Santorini",
    country: "Greece",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A stunning island known for its white-washed villages, breathtaking sunsets, and volcanic landscape.",
    rating: 4.9,
    tags: ["Beaches", "Island Getaway", "Romance"],
    budget: "Luxury",
  },
  {
    name: "Bali",
    country: "Indonesia",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A tropical island paradise known for its beautiful beaches, lush rice paddies, and ancient temples.",
    rating: 4.7,
    tags: ["Beaches", "Nature", "Culture"],
    budget: " High End",
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "An ancient Inca citadel nestled high in the Andes Mountains, a UNESCO World Heritage Site.",
    rating: 4.9,
    tags: ["History", "Adventure", "Ancient Wonders"],
    budget: "Mid Range",
  },
  {
    name: "Cairo",
    country: "Egypt",
    imageUrl: "/placeholder.webp?height=400&width=600",
    description:
      "A historic city known for its ancient pyramids, the Sphinx, and bustling markets.",
    rating: 4.6,
    tags: ["History", "Ancient Wonders", "Culture"],
    budget: "Budget Friendly",
  },
];

const apiKey = "AIzaSyC3NWbJrwjeTk5Gq98u2VvlOwy0edMKtXQ";

if (!apiKey) {
  throw new Error("Google API key is not set");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate a JSON response with details for the top popular destinations in the world. Include the following details:
            
          Top 20 destinations with the following details:
        For each destination, include:
        - Name
        - Country
        - Image URL (use '/placeholder.webp?height=400&width=600')
        - Description (a brief overview of the city)
        - Rating (between 4.5 and 5.0)
        - budget of something like (Economy, Mid-range, Premium, Luxury)
        - Tags (3 relevant tags describing the destination ( City Break", "Romance", "Culture","History,Art,Food,Modern,Beaches,Nightlife,Architecture,Luxury,Shopping,Culture,Relaxation,Island Getaway))

        Provide the response in JSON format`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: JSON.stringify(modelResponse, null, 2),
        },
      ],
    },
  ],
});

export async function getPopularPlaces(): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let prompt = `Generate a JSON response with details for the top popular destinations {in the Ireland Dublin}. Include the following details:
            
          Top 25 destinations with the following details:
        For each destination, include:
        -  Name
        - Country
        - Image URL (use '/placeholder.webp?height=400&width=600')
        - Description (a brief overview of the city)
        - Rating (between 4.5 and 5.0)
        - budget of something like (Economy, Mid-range, Premium, Luxury)
        - Tags (3 relevant tags describing the destination ( City Break", "Romance", "Culture","History,Art,Food,Modern,Beaches,Nightlife,Architecture,Luxury,Shopping,Culture,Relaxation,Island Getaway))

        Provide the response in JSON format`;

  // try {
  //   // const currentPlace = await getCurrentCountryAndLocation();
  //   // if (currentPlace) {
  //     //   prompt = prompt.replace('{in the word}', `in ${currentPlace.country}`);
  //   }
  // } catch (error) {
  //   console.error('Error fetching current place:', error);
  // }

  const response = await chatSession.sendMessage(prompt);
  if (response) {
    const text = await response.response.text();

    try {
      const parsedText = JSON.parse(text);
      const data = parsedText.map((place: any) => {
        const lowercasePlace: { [key: string]: any } = {};
        Object.keys(place).forEach((key) => {
          lowercasePlace[key.toLowerCase()] = place[key];
        });
        return {
          id: uuidv4(),
          ...lowercasePlace,
        };
      });
      return data;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  }

  return modelResponse.map((doc) => ({ id: uuidv4(), ...doc }));
}
