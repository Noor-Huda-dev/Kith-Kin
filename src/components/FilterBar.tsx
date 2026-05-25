import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { getCategories } from '../services/api';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
    isFiltersActive,
  } = useFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const categories = getCategories();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#fed286]/30 focus:bg-white/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {isFiltersActive && (
              <span className="w-2 h-2 bg-[#fed286] rounded-full" />
            )}
          </button>

          {/* Desktop Category Pills */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#fed286] text-[#1d2b30]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative ml-auto lg:ml-0" ref={sortRef}>
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-colors min-w-[160px]"
            >
              <span className="text-white/40 text-xs">Sort:</span>
              <span className="text-xs">
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </span>
              <ChevronDown
                size={14}
                className={`ml-auto transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1d2b30] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as typeof sortBy);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-[#fed286]/10 text-[#fed286]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters */}
          {isFiltersActive && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              <X size={12} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          mobileFiltersOpen ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
          {/* Mobile Categories */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[#fed286] text-[#1d2b30]'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3 block">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 accent-[#fed286]"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3 block">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                    minRating === rating
                      ? 'bg-[#fed286] text-[#1d2b30]'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                >
                  {rating > 0 ? (
                    <>
                      <Star size={10} fill="currentColor" />
                      {rating}+
                    </>
                  ) : (
                    'All'
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {isFiltersActive && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fed286]/10 text-[#fed286] text-xs rounded-full">
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}>
                <X size={10} />
              </button>
            </span>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 1000) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fed286]/10 text-[#fed286] text-xs rounded-full">
              ${priceRange[0]} - ${priceRange[1]}
              <button onClick={() => setPriceRange([0, 1000])}>
                <X size={10} />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fed286]/10 text-[#fed286] text-xs rounded-full">
              {minRating}+ Stars
              <button onClick={() => setMinRating(0)}>
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
