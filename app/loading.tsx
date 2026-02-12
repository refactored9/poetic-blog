export default function Loading() {
  return (
    <div className="wide-width py-12 md:py-16">
      {/* Hero skeleton */}
      <div className="mb-12">
        <div className="skeleton h-8 w-48 rounded mb-4" />
        <div className="skeleton h-5 w-96 max-w-full rounded" />
      </div>

      {/* Featured post skeleton */}
      <div className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="skeleton aspect-[4/3] rounded-lg" />
          <div className="flex flex-col justify-center gap-4">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-8 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-32 rounded mt-2" />
          </div>
        </div>
      </div>

      {/* Blog grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-0 overflow-hidden">
            <div className="skeleton aspect-[16/10]" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-5 w-full rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="flex gap-2 mt-3">
                <div className="skeleton h-6 w-16 rounded" />
                <div className="skeleton h-6 w-16 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
