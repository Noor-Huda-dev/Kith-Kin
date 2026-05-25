import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Product } from '../services/api';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'rating' | 'name';

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: SortOption;
}

interface FilterContextType extends FilterState {
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  filterProducts: (products: Product[]) => Product[];
  isFiltersActive: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000];

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange(DEFAULT_PRICE_RANGE);
    setMinRating(0);
    setSortBy('default');
  }, []);

  const isFiltersActive = useMemo(() => {
    return (
      searchQuery !== '' ||
      selectedCategory !== 'all' ||
      priceRange[0] > 0 ||
      priceRange[1] < 1000 ||
      minRating > 0 ||
      sortBy !== 'default'
    );
  }, [searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  const filterProducts = useCallback(
    (products: Product[]) => {
      let filtered = [...products];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }

      filtered = filtered.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      if (minRating > 0) {
        filtered = filtered.filter((p) => p.rating.rate >= minRating);
      }

      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating.rate - a.rating.rate);
          break;
        case 'name':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }

      return filtered;
    },
    [searchQuery, selectedCategory, priceRange, minRating, sortBy]
  );

  const value = useMemo(
    () => ({
      searchQuery,
      selectedCategory,
      priceRange,
      minRating,
      sortBy,
      setSearchQuery,
      setSelectedCategory,
      setPriceRange,
      setMinRating,
      setSortBy,
      resetFilters,
      filterProducts,
      isFiltersActive,
    }),
    [
      searchQuery,
      selectedCategory,
      priceRange,
      minRating,
      sortBy,
      setSearchQuery,
      setSelectedCategory,
      setPriceRange,
      setMinRating,
      setSortBy,
      resetFilters,
      filterProducts,
      isFiltersActive,
    ]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
