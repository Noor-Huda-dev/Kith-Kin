import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchProducts, fetchProductById, type Product } from '../services/api';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchData = useCallback(async () => {
    if (hasFetched.current && products.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      hasFetched.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    loading,
    error,
    refetch: () => {
      hasFetched.current = false;
      fetchData();
    },
  };
}

export function useProduct(id: number): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevId = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    if (prevId.current === id && product) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(id);
      setProduct(data);
      prevId.current = id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, product]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    product,
    loading,
    error,
    refetch: () => {
      prevId.current = null;
      fetchData();
    },
  };
}
