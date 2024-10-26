import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-secondary/50 rounded-lg p-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-40 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
