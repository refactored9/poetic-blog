export default function BlogLoading() {
  return (
    <article className="content-width py-12 md:py-16">
      {/* Back link skeleton */}
      <div className="skeleton h-4 w-24 rounded mb-8" />

      {/* Header skeleton */}
      <header className="mb-10">
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-6 w-16 rounded" />
          <div className="skeleton h-6 w-16 rounded" />
        </div>
        <div className="skeleton h-12 w-full rounded mb-3" />
        <div className="skeleton h-12 w-3/4 rounded mb-6" />
        <div className="flex items-center gap-4">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
      </header>

      {/* Cover image skeleton */}
      <div className="skeleton aspect-[16/9] rounded-lg mb-10" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-8 w-48 rounded mt-8 mb-4" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton aspect-[16/9] rounded-lg my-8" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-5/6 rounded" />
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2 mt-12 pt-8 border-t border-[var(--border)]">
        <div className="skeleton h-7 w-20 rounded" />
        <div className="skeleton h-7 w-24 rounded" />
        <div className="skeleton h-7 w-18 rounded" />
      </div>
    </article>
  );
}
