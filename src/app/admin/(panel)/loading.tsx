export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200/70 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-200/70 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
            key={`skel-card-${i}`}
            className="h-28 rounded-2xl bg-white border border-silver-400/20 p-5 space-y-3"
          >
            <div className="h-4 w-20 bg-slate-100 rounded" />
            <div className="h-6 w-14 bg-slate-200/70 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white border border-silver-400/25 p-6 space-y-4">
        <div className="h-6 w-36 bg-slate-200/70 rounded-lg" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
              key={`skel-row-${i}`}
              className="h-14 rounded-xl bg-sky-50/50 border border-silver-400/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
