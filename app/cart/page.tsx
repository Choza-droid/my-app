"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const fadeIn = true; // Always fade in
  const hasRedirected = useRef(false);

  useEffect(() => {
    // When cart becomes empty, fade out and redirect
    if (cart.length === 0 && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setFadeOut(true);
      }, 0);
      setTimeout(() => {
        router.push('/');
      }, 600); // Wait for fade animation to complete
    }
  }, [cart.length, router]);

  const handleBackToShop = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div 
      className={`min-h-screen bg-black text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0'
      }`} 
      style={{fontFamily: 'Courier New, monospace'}}
    >
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <div className="flex justify-start">
              <Link 
                href="/" 
                onClick={handleBackToShop}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
              >
                Home
              </Link>
            </div>
            <div className="flex justify-center text-2xl font-bold">
              Güero<span className="text-red-600">Gucci</span>
            </div>
            <div className="flex justify-end">
              <span className="text-gray-400">{cart.length} artículos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Tu Carrito</h1>

        {cart.length > 0 && (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-6 bg-zinc-800 p-6 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-400 mb-2">Color: {item.color} | Talla: {item.size}</p>
                    <p className="text-2xl font-bold text-red-600">${item.price} USD</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-400 hover:text-red-600 transition h-fit"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="bg-zinc-800 p-6 rounded-lg">
              <div className="flex justify-between items-center text-2xl font-bold mb-6">
                <span>Total:</span>
                <span className="text-red-600">${getTotalPrice()} USD</span>
              </div>
              <Link 
                href="/checkout"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg transition block text-center"
              >
                Proceder al Pago
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}