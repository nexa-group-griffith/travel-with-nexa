import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section Skeleton */}
      <section className="mb-16 text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-3/4 max-w-xl" />
        <Skeleton className="mx-auto h-6 w-2/3 max-w-lg" />
      </section>

      {/* Our Story Skeleton */}
      <section className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <Skeleton className="mb-4 h-10 w-48" />
          <Skeleton className="mb-4 h-24 w-full" />
          <Skeleton className="mb-4 h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </section>

      {/* Our Mission & Values Skeleton */}
      <section className="mb-16">
        <Skeleton className="mx-auto mb-8 h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <Skeleton className="mb-4 h-8 w-8" />
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Our Team Skeleton */}
      <section className="mb-16">
        <Skeleton className="mx-auto mb-8 h-10 w-48" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto mb-4 h-40 w-40 rounded-full" />
              <Skeleton className="mx-auto mb-2 h-6 w-32" />
              <Skeleton className="mx-auto h-4 w-24" />
            </div>
          ))}
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="mb-16">
        <Skeleton className="mx-auto mb-8 h-10 w-64" />
        <Skeleton className="mb-6 h-12 w-full" />
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-8 w-64" />
          <Skeleton className="mb-6 h-4 w-full max-w-md" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <div className="w-full">
                  <Skeleton className="mb-2 h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Skeleton */}
      <section className="mb-16">
        <Skeleton className="mx-auto mb-8 h-10 w-48" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="mb-6 h-4 w-64" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Skeleton className="mb-6 h-24 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="rounded-lg bg-primary/5 p-8 text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-64" />
        <Skeleton className="mx-auto mb-6 h-16 w-2/3" />
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Skeleton className="mx-auto h-12 w-32 sm:mx-0" />
          <Skeleton className="mx-auto h-12 w-48 sm:mx-0" />
        </div>
      </section>
    </div>
  )
}
