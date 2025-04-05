import Link from "next/link";
import "./globals.css";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight ">404</h1>
        <p className="text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
