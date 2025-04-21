import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price_100g: number | null;
  price_250g: number | null;
  price_500g: number | null;
  price_1kg: number | null;
  price_2kg: number | null;
  image_url: string;
  in_stock: boolean;
  created_at: string;
};

export type Order = {
  id: number;
  customer_name: string;
  phone_number: string;
  address: string;
  items: OrderItem[];
  total_amount: number;
  status: 'received' | 'processing' | 'out_for_delivery' | 'delivered';
  created_at: string;
};

export type OrderItem = {
  product_id: number;
  product_name: string;
  quantity: number;
  weight: '100g' | '250g' | '500g' | '1kg' | '2kg';
  price: number;
};

// API functions
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data as Product[];
};

export const fetchProductsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('name');
  
  if (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
  
  return data as Product[];
};

export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  
  return data[0] as Order;
};

export const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
  
  return data as Order[];
};

export const updateOrderStatus = async (id: number, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
  
  return data[0] as Order;
};

export const fetchOrderById = async (id: number) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
  
  return data as Order;
};
