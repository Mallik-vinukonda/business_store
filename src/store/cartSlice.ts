import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../services/supabase';

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  weight: '100g' | '250g' | '500g' | '1kg' | '2kg';
  imageUrl: string;
};

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      product: Product;
      weight: '100g' | '250g' | '500g' | '1kg' | '2kg';
      quantity: number;
    }>) => {
      const { product, weight, quantity } = action.payload;
      
      // Determine price based on weight
      let price = 0;
      switch (weight) {
        case '100g':
          price = product.price_100g || 0;
          break;
        case '250g':
          price = product.price_250g || 0;
          break;
        case '500g':
          price = product.price_500g || 0;
          break;
        case '1kg':
          price = product.price_1kg || 0;
          break;
        case '2kg':
          price = product.price_2kg || 0;
          break;
      }
      
      // Create unique cart item ID based on product ID and weight
      const cartItemId = parseInt(`${product.id}${weight.replace(/\D/g, '')}`);
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price,
          quantity,
          weight,
          imageUrl: product.image_url,
        });
      }

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
        
        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
