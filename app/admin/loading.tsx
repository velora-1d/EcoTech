export default function AdminLoading() {
  // ponytail: Loading skeleton admin dashboard untuk transisi tab instan tanpa lag visual
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Mock/Skeleton */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 hidden md:flex flex-col border-r border-slate-800 p-6 gap-6">
        <div>
          <div className="h-6 w-32 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-3 w-20 bg-slate-800 rounded mt-2 animate-pulse" />
        </div>
        <div className="flex-1 space-y-3 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-10 w-full bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-12 w-full bg-slate-850 rounded-xl animate-pulse" />
      </aside>

      {/* Main Content Area Skeleton */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 md:ml-64 w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
          </div>
          
          {/* Grid Stats Mock */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="h-8 w-8 bg-slate-100 rounded-xl" />
                <div className="h-6 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          {/* Large Card Mock */}
          <div className="h-64 bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-50 rounded" />
            <div className="h-4 w-5/6 bg-slate-55 rounded" />
            <div className="h-4 w-4/5 bg-slate-50 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
