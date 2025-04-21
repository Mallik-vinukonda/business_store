import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { Product, fetchProducts } from '../../services/supabase';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/cartSlice';
import Button from '../ui/Button';
import { productPlaceholder, detailPlaceholder } from '../../utils/fallbackImages';

type WeightOption = '100g' | '250g' | '500g' | '1kg' | '2kg';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>('250g');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        const foundProduct = products.find((p) => p.id === Number(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Find related products in the same category
          const related = products
            .filter(
              (p) => p.category === foundProduct.category && p.id !== foundProduct.id
            )
            .slice(0, 4);
          
          setRelatedProducts(related);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Get available weight options
  const getWeightOptions = () => {
    if (!product) return [];
    
    return [
      { weight: '100g', price: product.price_100g },
      { weight: '250g', price: product.price_250g },
      { weight: '500g', price: product.price_500g },
      { weight: '1kg', price: product.price_1kg },
      { weight: '2kg', price: product.price_2kg },
    ].filter((option) => option.price !== null);
  };

  // Get current price based on selected weight
  const getCurrentPrice = (): number => {
    const option = getWeightOptions().find((opt) => opt.weight === selectedWeight);
    return typeof option?.price === 'number' ? option.price : 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        product,
        weight: selectedWeight,
        quantity,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/products')}
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>
      </div>

      {/* Product Detail */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-80">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = detailPlaceholder;
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full uppercase">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Product Status */}
            <div className="mb-4">
              {product.in_stock ? (
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
                  In Stock
                </span>
              ) : (
                <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Weight Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Select Weight:</h3>
              <div className="flex flex-wrap gap-2">
                {getWeightOptions().map((option) => (
                  <button
                    key={option.weight}
                    className={`px-3 py-2 rounded-md border ${
                      selectedWeight === option.weight
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedWeight(option.weight as WeightOption)}
                  >
                    {option.weight} - <span>&#8377;{option.price?.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity:</h3>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                />
                <button
                  className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-2xl font-bold text-gray-900">
                {product && typeof getCurrentPrice() === 'number' ? (
                  <span>&#8377;{(getCurrentPrice() * quantity).toFixed(2)}</span>
                ) : (
                  <span>&#8377;0.00</span>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product || !product.in_stock}
                size="lg"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${relatedProduct.id}`)}
              >
                <div className="h-48 bg-gray-100">
                  <img
                    src={relatedProduct.image_url}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = productPlaceholder;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-primary transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="mt-1 text-gray-500">{relatedProduct.category}</p>
                  <p className="mt-2 font-semibold">
                    From <span>&#8377;{relatedProduct.price_100g?.toFixed(2) || 'N/A'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
