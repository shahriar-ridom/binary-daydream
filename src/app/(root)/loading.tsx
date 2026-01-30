import {
  HeroSkeleton,
  ProductGridSkeleton,
} from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <HeroSkeleton />

        {/* Grid Skeleton */}
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
