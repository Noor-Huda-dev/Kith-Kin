import { Loader2, AlertCircle, PackageOpen } from 'lucide-react';

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-[15px] bg-white/10 mb-4" />
          <div className="space-y-2 px-1">
            <div className="h-3 w-1/3 bg-white/10 rounded" />
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
            <div className="h-5 w-1/4 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductSkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[3/4] rounded-[15px] bg-white/10" />
        <div className="space-y-6">
          <div className="h-4 w-1/4 bg-white/10 rounded" />
          <div className="h-8 w-3/4 bg-white/10 rounded" />
          <div className="h-6 w-1/3 bg-white/10 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-2/3 bg-white/10 rounded" />
          </div>
          <div className="h-12 w-full bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader2 size={32} className="text-[#fed286] animate-spin" />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="font-display text-xl text-white mb-2">Something went wrong</h3>
      <p className="text-sm text-white/50 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No products found',
  message = 'Try adjusting your filters or search query.',
  onReset,
}: {
  title?: string;
  message?: string;
  onReset?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <PackageOpen size={28} className="text-white/30" />
      </div>
      <h3 className="font-display text-xl text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-md mb-6">{message}</p>
      {onReset && (
        <button onClick={onReset} className="btn-outline">
          Clear Filters
        </button>
      )}
    </div>
  );
}
