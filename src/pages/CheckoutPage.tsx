import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import CheckoutForm from '../components/checkout/CheckoutForm';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">
          Complete your order by providing your delivery details
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
