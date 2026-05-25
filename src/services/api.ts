const API_BASE = 'https://fakestoreapi.com';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'All Collections', slug: 'all' },
  { id: '2', name: 'New Arrivals', slug: 'new-arrivals' },
  { id: '3', name: 'Apparel', slug: "men's clothing" },
  { id: '4', name: 'Accessories', slug: "women's clothing" },
  { id: '5', name: 'Homeware', slug: 'jewelery' },
  { id: '6', name: 'Sale', slug: 'electronics' },
];

let cachedProducts: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  if (cachedProducts && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Product[] = await response.json();

    const enhancedData = data.map((product) => ({
      ...product,
      price: Math.round(product.price * 10) / 10,
    }));

    cachedProducts = enhancedData;
    cacheTimestamp = Date.now();
    return enhancedData;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    if (cachedProducts) {
      return cachedProducts;
    }
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    throw error;
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/products/category/${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch category ${category}:`, error);
    throw error;
  }
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryName(slug: string): string {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return cat?.name || 'All Collections';
}

export function getLocalProductImage(id: number): string {
  return `https://picsum.photos/seed/${id + 100}/600/800`;
}
