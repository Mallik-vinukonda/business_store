import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaTruck, FaMedal } from 'react-icons/fa';
import { fetchProducts, Product } from '../services/supabase';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        // Get random 4 products for featured section
        const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedProducts(randomProducts);
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-white text-gray-900 min-h-[50vh] flex items-center border-b border-gray-100">
        <div className="container-custom relative z-10 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Premium Quality <span className="text-primary">Dry Fruits & Nuts</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-700">
              Discover the finest selection of dry fruits and nuts at Sri Ramdoot Dryfruit Store, Vizag's trusted source for premium quality since 2005.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
                onClick={() => window.location.href = '/products'}
              >
                Shop Now <FaArrowRight className="inline-block ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 text-primary border-primary hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Hero image from assets */}
            <img src="/src/assets/images/c.webp" alt="Premium Dry Fruits" className="w-[320px] md:w-[400px]   bg-white/80 object-cover" />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <FaLeaf size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We source the finest quality dry fruits and nuts directly from trusted suppliers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <FaTruck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Free Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy free delivery on all orders above ₹500 within Vizag city.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <FaMedal size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to quality and service keeps our customers coming back.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-primary hover:text-primary/80 flex items-center"
            >
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Rajesh Kumar</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The quality of dry fruits from Sri Ramdoot is exceptional. I've been a regular customer for over 3 years now and have never been disappointed."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Supriya Reddy</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I love the variety of nuts and dry fruits available here. The free delivery service is prompt and reliable. Highly recommended!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  V
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Venkat Rao</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Great selection of premium dry fruits at reasonable prices. The cashews and pistachios are my favorites. Will definitely order again."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order Premium Dry Fruits?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore our wide range of high-quality dry fruits and nuts. <br />
            Free delivery on orders above ₹500 in Vizag.
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-500 text-black hover:bg-primary/10 hover:text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border-0 border-primary"
            style={{ borderWidth: 2 }}
            onClick={() => window.location.href = '/products'}
          >
            <span className="font-bold">Shop Now</span> <FaArrowRight className="inline-block ml-2" />
          </Button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
