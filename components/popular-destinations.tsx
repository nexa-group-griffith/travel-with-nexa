import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { RatingComponent } from "./rating";
import { FaMoneyBill, FaMoneyBillWaveAlt } from "react-icons/fa";

const destinations = [
  {
    id: "41b9f7c1-8544-4e46-90d7-3ce749d77223",
    name: "Glendalough",
    country: "Ireland",
    "image url":
      "https://www.collinsdaytours.com/wp-content/uploads/2019/07/rsz_glendalough-1.jpg?height=400&width=600",
    description:
      "A scenic valley with monastic ruins and stunning natural beauty.",
    rating: 4.9,
    tags: ["Nature", "History", "Culture"],
    budget: "Luxury",
  },
  {
    id: "b43fe296-a895-4c2d-8a63-9b605ff01742",
    name: "Trinity College Library",
    country: "Ireland",
    "image url":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Long_Room_Interior%2C_Trinity_College_Dublin%2C_Ireland_-_Diliff.jpg/640px-Long_Room_Interior%2C_Trinity_College_Dublin%2C_Ireland_-_Diliff.jpg?height=400&width=600",
    description: "The iconic Long Room library at Trinity College.",
    rating: 4.9,
    tags: ["History", "Culture", "City Break"],
    budget: "Luxury",
  },
  {
    id: "ca2558e6-bac9-4d58-aae0-18019b2ac280",
    name: "Kilmainham Gaol",
    country: "Ireland",
    "image url":
      "https://www.biddymurphy.com/cdn/shop/articles/kilmainham-gaol_1800x.jpg?v=1484150964?height=400&width=600",
    description: "A former prison with a significant role in Irish history.",
    rating: 4.8,
    tags: ["History", "Culture", "City Break"],
    budget: "Mid Range",
  },
  {
    id: "4a3d88dc-ff57-4baf-a147-98f2a048058d",
    name: "Little Museum of Dublin",
    country: "Ireland",
    "image url":
      "https://dodublin.ie/images/dublinpics/stop-12-little-museum-dodublin.jpg?height=400&width=600",
    description:
      "A small museum showcasing the history of Dublin in the 20th century.",
    rating: 4.8,
    tags: ["History", "Culture", "City Break"],
    budget: "Mid Range",
  },
];

export function PopularDestinations() {
  const router = useRouter();

  const openInGoogleMaps = (searchQuery: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchQuery,
      )}`,
      "_blank",
    );
  };

  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold">Popular Destinations</h2>
        <p className="text-lg text-muted-foreground">
          Discover trending destinations loved by travelers around the world
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations?.map((destination) => (
          <Card
            key={destination.id}
            className="overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg rounded-lg cursor-pointer"
            onClick={() => {
              router.push(`/destinations/${destination.id}`);
            }}
          >
            <div className="relative h-48 w-full">
              <Image
                src={destination?.["image url"] || "/placeholder.webp"}
                alt={destination?.name ?? "Destination"}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-1">
                <MapPin className="mr-2 h-6 w-6" /> {destination?.name},{" "}
                {destination?.country}
              </CardTitle>
              <div className="flex items-center gap-1">
                <RatingComponent rating={destination.rating} />
                <span className="ml-2">{destination.rating}/5</span>
              </div>
              <CardDescription className="flex items-center gap-1">
                <FaMoneyBillWaveAlt />
                {destination?.budget}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {destination?.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {destination?.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-4">
              <div className="flex w-full gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/destinations/${destination?.id}`}>Explore</Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInGoogleMaps(
                      `${destination?.name}, ${destination?.country}`,
                    );
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/destinations">View All Destinations</Link>
        </Button>
      </div>
    </section>
  );
}
