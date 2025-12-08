"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  cartId: number;
  colors: string[];
  sizes: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('guero-gucci-cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('❌ Failed to load cart:', e);
          return [];
        }
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('💾 Saving cart to localStorage:', cart);
    localStorage.setItem('guero-gucci-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    console.log('➕ Adding to cart:', item);
    setCart(prevCart => {
      const newCart = [...prevCart, item];
      console.log('📊 New cart state:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (cartId: number) => {
    console.log('➖ Removing from cart:', cartId);
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    console.log('🗑️ Clearing cart');
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  console.log('🛒 Current cart state:', cart);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}