import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center section-cream">
      <div className="text-center px-6">
        <div className="mb-8">
          <span className="font-display text-[120px] md:text-[180px] leading-none text-[#1d2b30]/10">
            404
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-[#1d2b30] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#1d2b30]/50 max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#1d2b30]/10 text-[#1d2b30] rounded-[15px] text-sm font-medium hover:bg-[#1d2b30]/5 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d2b30] text-white rounded-[15px] text-sm font-medium hover:bg-[#2a3f45] transition-colors"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
