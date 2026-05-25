import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'TOGGLE_ITEM'; payload: WishlistItem }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'HYDRATE'; payload: WishlistItem[] };

const WISHLIST_STORAGE_KEY = 'kith_wishlist';

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'TOGGLE_ITEM': {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    case 'HYDRATE':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) });
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage');
    }
  }, [state.items]);

  const addItem = useCallback((item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: item });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const isInWishlist = useCallback(
    (id: number) => state.items.some((item) => item.id === id),
    [state.items]
  );

  const totalItems = useMemo(() => state.items.length, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
      isInWishlist,
      totalItems,
    }),
    [state.items, addItem, removeItem, toggleItem, clearWishlist, isInWishlist, totalItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
