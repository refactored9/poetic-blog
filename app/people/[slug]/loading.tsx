export default function PersonLoading() {
  return (
    <div className="wide-width py-12 md:py-16">
      {/* Back link skeleton */}
      <div className="skeleton h-4 w-32 rounded mb-8" />

      {/* Profile header skeleton */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Left - Image */}
        <div className="md:col-span-1">
          <div className="skeleton aspect-square rounded-xl" />
        </div>

        {/* Right - Info */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="skeleton h-10 w-64 rounded mb-3" />
          <div className="skeleton h-6 w-48 rounded mb-4" />
          <div className="skeleton h-5 w-full rounded mb-2" />
          <div className="skeleton h-5 w-full rounded mb-2" />
          <div className="skeleton h-5 w-3/4 rounded mb-6" />

          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="text-center">
              <div className="skeleton h-8 w-16 rounded mb-1" />
              <div className="skeleton h-4 w-12 rounded" />
            </div>
            <div className="text-center">
              <div className="skeleton h-8 w-16 rounded mb-1" />
              <div className="skeleton h-4 w-12 rounded" />
            </div>
            <div className="text-center">
              <div className="skeleton h-8 w-16 rounded mb-1" />
              <div className="skeleton h-4 w-12 rounded" />
            </div>
          </div>

          {/* Contact button */}
          <div className="skeleton h-12 w-40 rounded-lg" />
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="space-y-8">
        <div className="card p-6">
          <div className="skeleton h-7 w-32 rounded mb-4" />
          <div className="skeleton h-5 w-full rounded mb-2" />
          <div className="skeleton h-5 w-full rounded mb-2" />
          <div className="skeleton h-5 w-2/3 rounded" />
        </div>

        <div className="card p-6">
          <div className="skeleton h-7 w-40 rounded mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Gallery skeleton */}
        <div className="card p-6">
          <div className="skeleton h-7 w-24 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
