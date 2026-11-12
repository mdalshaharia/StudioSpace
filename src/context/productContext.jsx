'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
const ProductContext = createContext(null);
export function ProductProvider({
  children
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data (Status: ${res.status})`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
      setError(null);
    } catch (err) {
      console.error('Product fetch error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, [loadProducts]);
  return <ProductContext.Provider value={{
    products,
    loading,
    error,
    refresh: loadProducts
  }}>
      {children}
    </ProductContext.Provider>;
}
export default ProductContext;
