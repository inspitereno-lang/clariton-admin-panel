import { useState, useCallback } from 'react';
import type { Product, Store } from '@/types';
import { initialProducts, initialStores } from '@/data/mockData';

// Product Store Hook
export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'sku'>) => {
    const newId = (products.length + 1).toString();
    const brandPrefix = product.brand.substring(0, 2).toUpperCase();
    const categoryPrefix = product.category.substring(0, 2).toUpperCase();
    const newSku = `${brandPrefix}-${categoryPrefix}-${newId.padStart(3, '0')}`;
    
    const newProduct: Product = {
      ...product,
      id: newId,
      sku: newSku
    };
    
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products.length]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };
}

// Store Store Hook
export function useStoreStore() {
  const [stores, setStores] = useState<Store[]>(initialStores);

  const addStore = useCallback((store: Omit<Store, 'id'>) => {
    const newId = (stores.length + 1).toString();
    
    const newStore: Store = {
      ...store,
      id: newId
    };
    
    setStores(prev => [...prev, newStore]);
    return newStore;
  }, [stores.length]);

  const updateStore = useCallback((id: string, updates: Partial<Store>) => {
    setStores(prev => 
      prev.map(store => 
        store.id === id ? { ...store, ...updates } : store
      )
    );
  }, []);

  const deleteStore = useCallback((id: string) => {
    setStores(prev => prev.filter(store => store.id !== id));
  }, []);

  const getStoreById = useCallback((id: string) => {
    return stores.find(store => store.id === id);
  }, [stores]);

  return {
    stores,
    addStore,
    updateStore,
    deleteStore,
    getStoreById
  };
}
