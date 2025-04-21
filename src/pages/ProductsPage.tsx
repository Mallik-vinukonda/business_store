import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '../services/supabase';
import ProductList from '../components/product/ProductList';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-600 mt-2">
          Explore our wide range of premium quality dry fruits and nuts
        </p>
      </div>

      <ProductList 
        products={products} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default ProductsPage;
