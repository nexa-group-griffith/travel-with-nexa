import { GoogleGenerativeAI } from "@google/generative-ai";
export interface TravelGuide {
  culture: {
    description: string;
    examples: string[];
  };
  history: {
    description: string;
    examples: string[];
  };
  landmarks: {
    description: string;
    examples: {
      name: string;
      description: string;
    }[];
  };
}

interface Destination {
  city: string;
  country: string;
  travelGuide: TravelGuide;
}

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
  responseMimeType: "text/plain",
};
export const chatSession1 = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Hi, I want to plan a trip to Paris, France. Can you provide me with information about the city, Travel Guide, such as its culture, history, and landmarks?",
        },
      ],
    },
  ],
});
export const chatSession2 = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Hi, explain about paris for travel in 100 words",
        },
      ],
    },
  ],
});

export async function generateDestinationInfo(
  destination: string,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const response = await chatSession1.sendMessage(
    `Hi, I want to plan a trip to ${destination}. Can you provide me with information about the city, Travel Guide, such as its culture, history, and landmarks?`,
  );
  if (response) {
    const text = await response.response.text();
    try {
      return text;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  }
  return "";
}

export async function generateAboutPlace(destination: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const response = await chatSession2.sendMessage(
    `Hi, explain about ${destination} for travel in 100 words`,
  );
  if (response) {
    const text = await response.response.text();
    try {
      return text;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  }
  return "";
}
