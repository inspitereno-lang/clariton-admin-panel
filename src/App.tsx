import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { ProductList } from '@/pages/ProductList';
import { ProductForm } from '@/pages/ProductForm';
import { StoreList } from '@/pages/StoreList';
import { StoreForm } from '@/pages/StoreForm';
import { Settings } from '@/pages/Settings';
import { LoginPage } from '@/pages/LoginPage';
import { useProductStore, useStoreStore } from '@/hooks/useStore';
import type { Product, Store } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { stores, addStore, updateStore, deleteStore } = useStoreStore();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    toast.success('Welcome to Claritone Admin Panel');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    toast.info('Signed out successfully');
  };

  const handleProductSave = (product: Product | Omit<Product, 'id' | 'sku'>) => {
    if ('id' in product) {
      updateProduct(product.id, product);
      toast.success('Product updated successfully');
    } else {
      addProduct(product);
      toast.success('Product added successfully');
    }
  };

  const handleProductDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted successfully');
  };

  const handleStoreSave = (store: Store | Omit<Store, 'id'>) => {
    if ('id' in store) {
      updateStore(store.id, store);
      toast.success('Store updated successfully');
    } else {
      addStore(store);
      toast.success('Store added successfully');
    }
  };

  const handleStoreDelete = (id: string) => {
    deleteStore(id);
    toast.success('Store deleted successfully');
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } />

          <Route path="/*" element={
            isAuthenticated ? (
              <div className="flex w-full min-h-screen">
                <Sidebar onLogout={handleLogout} />
                <main className="flex-1 ml-64 min-h-screen relative">
                  <Routes>
                    <Route
                      path="/"
                      element={<Dashboard products={products} stores={stores} />}
                    />
                    <Route
                      path="/products"
                      element={<ProductList products={products} onDelete={handleProductDelete} />}
                    />
                    <Route
                      path="/products/add"
                      element={<ProductForm products={products} onSave={handleProductSave} />}
                    />
                    <Route
                      path="/products/edit/:id"
                      element={<ProductForm products={products} onSave={handleProductSave} />}
                    />
                    <Route
                      path="/stores"
                      element={<StoreList stores={stores} onDelete={handleStoreDelete} />}
                    />
                    <Route
                      path="/stores/add"
                      element={<StoreForm stores={stores} onSave={handleStoreSave} />}
                    />
                    <Route
                      path="/stores/edit/:id"
                      element={<StoreForm stores={stores} onSave={handleStoreSave} />}
                    />
                    <Route
                      path="/settings"
                      element={<Settings />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
