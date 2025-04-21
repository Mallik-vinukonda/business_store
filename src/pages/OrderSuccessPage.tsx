import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaListAlt } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { useAppDispatch } from '../store';

interface LocationState {
  orderId?: number;
  customerName?: string;
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = location.state as LocationState;

  // Redirect to home if no order info is available
  useEffect(() => {
    // Fallback: if state/orderId missing, try to get from sessionStorage
    if (!state || !state.orderId) {
      const saved = sessionStorage.getItem('orderSuccess');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.orderId) {
          navigate('/order-success', { replace: true, state: parsed });
          return;
        }
      }
      navigate('/');
    } else {
      // Clear cart only after order success is shown
      dispatch({ type: 'cart/clearCart' });
    }
  }, [state, navigate, dispatch]);

  if (!state || !state.orderId) {
    return null;
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
        <div className="text-green-500 mb-4">
          <FaCheckCircle size={64} className="mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you, {state.customerName || 'Customer'}, for your order.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 mb-2">Order Reference</p>
          <p className="text-lg font-semibold text-gray-900">#{state.orderId}</p>
        </div>
        
        <div className="text-left mb-6">
          <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary mr-2">1.</span>
              You will receive a confirmation call from our team.
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">2.</span>
              Your order will be prepared and packed with care .
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">3.</span>
              We will deliver your order to your address in Vizag.
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1">
            <Button variant="outline" fullWidth>
              <FaHome className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button fullWidth>
              <FaListAlt className="mr-2" />
              Browse More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
