import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div style={{ backgroundImage: "url(/placeholder.webp)" }}>
      <section className="relative py-20 bg-cover bg-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Discover the World with{" "}
            <span className="text-primary">Nexa Group</span>
          </h1>
          <p className="mb-10 text-xl text-muted-foreground">
            Your all-in-one travel companion for planning trips, discovering
            destinations, and traveling with confidence.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login?redirect=/plan-trip">Plan Your Trip</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login?redirect=/destinations">
                Explore Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
