export default function JourneysLoading() {
  return (
    <div className="wide-width py-12 md:py-16">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="skeleton h-10 w-64 mx-auto rounded mb-4" />
        <div className="skeleton h-5 w-96 max-w-full mx-auto rounded" />
      </div>

      {/* Journey cards skeleton - masonry-like grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="card overflow-hidden"
            style={{ height: `${300 + (i % 3) * 80}px` }}
          >
            <div className="skeleton h-full w-full" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
              <div className="skeleton h-6 w-3/4 rounded mb-2 bg-white/20" />
              <div className="skeleton h-4 w-1/2 rounded bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
