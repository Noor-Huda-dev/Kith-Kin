import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import { useProducts } from '../hooks/useProducts';
import { useFilters } from '../context/FilterContext';
import { ProductSkeletonGrid, ErrorState, EmptyState } from '../components/LoadingStates';

export default function Collections() {
  const { products, loading, error, refetch } = useProducts();
  const { filterProducts, resetFilters, isFiltersActive } = useFilters();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const categoryParam = searchParams.get('category');

  useEffect(() => {
    if (categoryParam) {
      // Will be handled by FilterContext via URL
    }
  }, [categoryParam]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = filterProducts(products);

  if (error) {
    return (
      <main className="w-full min-h-screen pt-24 pb-12 section-cream">
        <div className="w-full px-6 lg:px-10">
          <div className="max-w-7xl mx-auto [&_h3]:text-[#1d2b30] [&_p]:text-[#1d2b30]/50">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen pt-24 pb-12 section-cream">
      <div className="w-full px-6 lg:px-10" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div
            className={`mb-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1d2b30]/40 mb-3">
              Browse Our
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1d2b30] mb-4">
              Collections
            </h1>
            <p className="text-[#1d2b30]/60 max-w-lg">
              Explore our curated selection of premium essentials, each piece thoughtfully designed for the modern connoisseur.
            </p>
          </div>

          {/* Filters */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <FilterBar />
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-6">
              <p className="text-sm text-[#1d2b30]/50">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {isFiltersActive && ' with applied filters'}
              </p>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="[&_.animate-pulse_div]:bg-[#1d2b30]/10">
              <ProductSkeletonGrid count={12} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="[&_h3]:text-[#1d2b30] [&_p]:text-[#1d2b30]/50">
              <EmptyState onReset={resetFilters} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="fade-in-up [&_.text-white]:text-[#1d2b30] [&_.text-white\/80]:text-[#1d2b30]/80 [&_.text-white\/60]:text-[#1d2b30]/60 [&_.text-white\/40]:text-[#1d2b30]/40 [&_.bg-white\/5]:bg-[#1d2b30]/5 [&_.bg-white\/10]:bg-[#1d2b30]/10 [&_.border-white\/10]:border-[#1d2b30]/10 [&_.hover\:bg-white\/20]:hover:bg-[#1d2b30]/20 [&_.text-white\/20]:text-[#1d2b30]/20 [&_.hover\:text-white]:hover:text-[#1d2b30] [&_.from-black\/40]:from-[#1d2b30]/20"
                  style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
