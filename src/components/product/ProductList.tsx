import { useState, useEffect } from 'react';
import { Product } from '../../services/supabase';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
}

const ProductList = ({ products, isLoading = false, error = null }: ProductListProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map((product) => product.category))];

  useEffect(() => {
    // Filter products by category
    let filtered = products;
    if (activeCategory !== 'all') {
      filtered = products.filter((product) => product.category === activeCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'name-asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => (a.price_250g || 0) - (b.price_250g || 0));
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => (b.price_250g || 0) - (a.price_250g || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Sort */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Results Count */}
      <div className="mt-6 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductList;
