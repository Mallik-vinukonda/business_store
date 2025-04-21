import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import Button from '../ui/Button';

const CartSummary = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  
  // Calculate delivery charge (free for orders above ₹500)
  const deliveryCharge = totalAmount >= 500 || items.length === 0 ? 0 : 50;
  const finalAmount = totalAmount + deliveryCharge;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Delivery Charge</span>
          {deliveryCharge === 0 ? (
            <span className="text-green-600">FREE</span>
          ) : (
            <span>₹{deliveryCharge.toFixed(2)}</span>
          )}
        </div>
        
        {totalAmount > 0 && totalAmount < 500 && (
          <div className="text-sm text-primary bg-primary/10 p-2 rounded">
            Add ₹{(500 - totalAmount).toFixed(2)} more to get FREE delivery!
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total Amount</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate('/checkout')} 
        fullWidth 
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          fullWidth 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
