import {
  MapPin,
  Shield,
  Sun,
  CreditCard,
  Star,
  Clock,
  Bus,
  Hotel,
  User,
  Brain,
  Map,
  Utensils,
} from "lucide-react";

const features = [
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Destination Discovery",
    description:
      "Explore top destinations with detailed information and travel guides.",
  },
  {
    icon: <Sun className="h-10 w-10 text-primary" />,
    title: "Weather Updates",
    description:
      "Real-time weather forecasts to help you plan your activities.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Safety Alerts",
    description:
      "Stay informed about security warnings and fraud alerts at your destination.",
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Reviews & Ratings",
    description:
      "Authentic reviews from fellow travelers for hotels, restaurants, and attractions.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Attraction Hours",
    description:
      "Opening and closing times for popular attractions to optimize your itinerary.",
  },
  {
    icon: <Bus className="h-10 w-10 text-primary" />,
    title: "Transportation Info",
    description:
      "Local transportation options and schedules for seamless travel.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: "Currency Exchange",
    description: "Up-to-date currency exchange rates for your travel budget.",
  },
  {
    icon: <Hotel className="h-10 w-10 text-primary" />,
    title: "Accommodation",
    description:
      "Personalized hotel recommendations based on your preferences.",
  },
  {
    icon: <User className="h-10 w-10 text-primary" />,
    title: "Local Guide",
    description:
      "Find experienced local guides for personalized tours and insights.",
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "AI Suggestions",
    description:
      "Smart recommendations for places, activities, and dining based on your interests.",
  },
  {
    icon: <Map className="h-10 w-10 text-primary" />,
    title: "Map Support for Places",
    description:
      "Interactive maps to explore locations, plan routes, and find nearby attractions.",
  },
  {
    icon: <Utensils className="h-10 w-10 text-primary" />,
    title: "Restaurants",
    description:
      "Discover top-rated restaurants, cuisines, and dining experiences nearby.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Everything You Need for Your Journey
        </h2>
        <p className="mb-12 text-lg text-muted-foreground">
          Nexa provides all the essential tools and information for a perfect
          trip
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:shadow-lg hover:shadow-primary hover:scale-105"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
