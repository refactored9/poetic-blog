export default function PeopleLoading() {
  return (
    <div className="wide-width py-12 md:py-16">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="skeleton h-10 w-56 mx-auto rounded mb-4" />
        <div className="skeleton h-5 w-80 max-w-full mx-auto rounded" />
      </div>

      {/* Filter skeleton */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* People grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-0 overflow-hidden">
            {/* Cover image */}
            <div className="skeleton h-32" />
            {/* Profile section */}
            <div className="p-5 pt-0 -mt-10 relative">
              <div className="skeleton w-20 h-20 rounded-full border-4 border-[var(--background-card)] mb-4" />
              <div className="skeleton h-6 w-3/4 rounded mb-2" />
              <div className="skeleton h-4 w-full rounded mb-3" />
              <div className="flex gap-2 mb-4">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
