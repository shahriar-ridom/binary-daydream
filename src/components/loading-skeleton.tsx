export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-video rounded-2xl bg-white/10 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-transparent to-white/5" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {/* Title & Description */}
        <div className="space-y-3">
          {/* Title Line */}
          <div className="h-7 w-3/4 rounded-lg bg-white/10" />
          {/* Description Lines */}
          <div className="h-4 w-full rounded-md bg-white/5" />
          <div className="h-4 w-5/6 rounded-md bg-white/5" />
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
          <div className="space-y-2">
            {/* Price Label */}
            <div className="h-3 w-12 rounded bg-white/5" />
            {/* Price Value */}
            <div className="h-6 w-20 rounded-md bg-white/10" />
          </div>
          {/* Action Button */}
          <div className="h-10 w-24 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background Placeholder */}
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center animate-pulse">
          {/* System Badge Skeleton */}
          <div className="mb-8 h-8 w-48 rounded-full bg-white/5 border border-white/5" />

          {/* Headline Skeleton */}
          <div className="mb-4 h-14 md:h-20 w-3/4 rounded-3xl bg-white/10" />
          <div className="mb-8 h-14 md:h-20 w-1/2 rounded-3xl bg-white/10" />

          {/* Subtext Skeleton */}
          <div className="mb-3 h-5 w-2/3 rounded-lg bg-white/5" />
          <div className="mb-12 h-5 w-1/2 rounded-lg bg-white/5" />

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            {/* Primary Pill Button */}
            <div className="h-14 w-44 rounded-full bg-white/20" />
            {/* Secondary Pill Button */}
            <div className="h-14 w-44 rounded-full bg-white/5 border border-white/5" />
          </div>

          {/* HUD Stats Grid Skeleton */}
          <div className="w-full max-w-4xl opacity-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-6 bg-[#050505]"
                >
                  <div className="mb-2 h-3 w-16 rounded bg-white/10" />
                  <div className="h-8 w-16 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
