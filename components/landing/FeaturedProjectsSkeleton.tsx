import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedProjectsSkeleton() {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="mt-2 h-4 w-24" />
            <Skeleton className="mt-4 h-16 w-full" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }