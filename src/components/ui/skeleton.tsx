import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

export const VehicleCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Skeleton className="w-full aspect-video" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const SearchResultsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <VehicleCardSkeleton key={i} />
    ))}
  </div>
);
