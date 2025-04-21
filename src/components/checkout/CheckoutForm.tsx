import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '../../store';
import { createOrder } from '../../services/supabase';
import { sendOrderNotification } from '../../services/telegram';
import Button from '../ui/Button';

// Indian phone number regex
const phoneRegExp = /^[6-9]\d{9}$/;

// Vizag area pincode range
const vizagPincodes = ['530001', '530002', '530003', '530004', '530005', '530006', '530007', '530008', '530009', '530010', '530011', '530012', '530013', '530014', '530015', '530016', '530017', '530018', '530020', '530022', '530024', '530026', '530027', '530028', '530029', '530031', '530032', '530035', '530040', '530041', '530043', '530044', '530045', '530046', '530047', '530048', '530051', '530052', '531001', '531002', '531011', '531035', '531055', '531061', '531084', '531085', '531087', '531093', '531151', '531162', '531163', '531173', '531219'];

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate delivery charge (free for orders above ₹500)
  const deliveryCharge = totalAmount >= 500 ? 0 : 50;
  const finalAmount = totalAmount + deliveryCharge;

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: 'Visakhapatnam',
      pincode: '',
      landmark: '',
      notes: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required('Full name is required')
        .min(3, 'Name must be at least 3 characters'),
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(phoneRegExp, 'Please enter a valid Indian phone number'),
      email: Yup.string()
        .email('Invalid email address'),
      address: Yup.string()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters'),
      city: Yup.string()
        .required('City is required')
        .oneOf(['Visakhapatnam'], 'We only deliver in Visakhapatnam'),
      pincode: Yup.string()
        .required('Pincode is required')
        .oneOf(vizagPincodes, 'We only deliver in Visakhapatnam area'),
      landmark: Yup.string(),
      notes: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (items.length === 0) {
        setError('Your cart is empty');
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        
        // Format address
        const fullAddress = `${values.address}, ${values.landmark ? values.landmark + ', ' : ''}${values.city} - ${values.pincode}`;
        
        // Format order items
        const orderItems = items.map(item => ({
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          weight: item.weight,
          price: item.price,
        }));
        
        // Create order in database
        const order = await createOrder({
          customer_name: values.fullName,
          phone_number: values.phoneNumber,
          address: fullAddress,
          items: orderItems,
          total_amount: finalAmount,
          status: 'received',
        });
        
        // Send Telegram notification
        await sendOrderNotification(order);
        
        // Save order info to sessionStorage for fallback
        sessionStorage.setItem('orderSuccess', JSON.stringify({
          orderId: order.id,
          customerName: values.fullName
        }));
        
        // Navigate to success page
        navigate('/order-success', { 
          state: { 
            orderId: order.id,
            customerName: values.fullName
          } 
        });
        
      } catch (err) {
        console.error('Checkout error:', err);
        setError('Failed to place your order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              id="fullName"
              type="text"
              className={`input ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Your full name"
              {...formik.getFieldProps('fullName')}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className={`input ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="10-digit mobile number"
              {...formik.getFieldProps('phoneNumber')}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Your email address (optional)"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <textarea
              id="address"
              rows={3}
              className={`input ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
              placeholder="Your complete address"
              {...formik.getFieldProps('address')}
            ></textarea>
            {formik.touched.address && formik.errors.address && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
              Landmark (Optional)
            </label>
            <input
              id="landmark"
              type="text"
              className="input"
              placeholder="Nearby landmark for easy delivery"
              {...formik.getFieldProps('landmark')}
            />
          </div>
          
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode*
            </label>
            <input
              id="pincode"
              type="text"
              className={`input ${formik.touched.pincode && formik.errors.pincode ? 'border-red-500' : ''}`}
              placeholder="6-digit pincode"
              {...formik.getFieldProps('pincode')}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.pincode}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              id="city"
              type="text"
              className="input bg-gray-100"
              disabled
              {...formik.getFieldProps('city')}
            />
            <div className="text-xs text-primary mt-1">We currently deliver only in Visakhapatnam</div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Order Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="input"
              placeholder="Any special instructions for delivery"
              {...formik.getFieldProps('notes')}
            ></textarea>
          </div>
        </div>
      </div>
      
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
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || items.length === 0}
          >
            Place Order
          </Button>
          
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => navigate('/cart')}
            disabled={isSubmitting}
          >
            Back to Cart
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
