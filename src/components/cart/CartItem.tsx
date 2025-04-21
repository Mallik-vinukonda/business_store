import { FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../../store';
import { CartItem as CartItemType, updateQuantity, removeFromCart } from '../../store/cartSlice';
import { thumbnailPlaceholder } from '../../utils/fallbackImages';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-4 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = thumbnailPlaceholder;
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col sm:flex-row">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">Weight: {item.weight}</p>
          <p className="text-sm text-gray-500">Price: ₹{item.price.toFixed(2)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center border rounded-md mr-4">
            <button
              className="px-2 py-1 text-gray-600 hover:text-primary"
              onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 py-1 min-w-[2rem] text-center">{item.quantity}</span>
            <button
              className="px-2 py-1 text-gray-600 hover:text-primary"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Subtotal and Remove */}
          <div className="flex flex-col items-end">
            <span className="font-semibold text-gray-900">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 mt-1 text-sm flex items-center"
              aria-label="Remove item"
            >
              <FaTrash className="mr-1" size={12} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
