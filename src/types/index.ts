// Re-export types from services for easier imports
export * from '../services/supabase';

// Auth related types
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

// UI related types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Cart related types
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Form related types
export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
