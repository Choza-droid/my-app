"use client";

import { useState } from 'react';

export default function MerchStore() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Array<typeof products[0]>>([]);

  const products = [
    {
      id: 1,
      name: "Tiger Stripe Hoodie",
      price: 65,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
    },
    {
      id: 2,
      name: "Lion Pride T-Shirt",
      price: 35,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"
    },
    {
      id: 3,
      name: "Panther Black Hoodie",
      price: 70,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
    },
    {
      id: 4,
      name: "Wolf Pack Polo",
      price: 45,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"
    },
    {
      id: 5,
      name: "Eagle Flight Jacket",
      price: 85,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
    },
    {
      id: 6,
      name: "Shark Bite Tee",
      price: 30,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"
    }
  ];

  const addToCart = (product: typeof products[0]) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: 'Courier New, monospace'}}>
      {/* Header/Navigation */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Home Button - Left */}
            <div className="flex justify-start">
              <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition">
                Home
              </a>
            </div>

            {/* Logo - Center */}
            <div className="flex justify-center text-2xl font-bold">
              <span className="text-blue-500">BRAND</span>MERCH
            </div>

            {/* Cart Icon - Right */}
            <div className="flex justify-end items-center space-x-4">
              <button className="relative hover:text-blue-500 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <nav className="px-4 py-4 space-y-3">
              <a href="#" className="block hover:text-blue-500 transition">Shop</a>
              <a href="#" className="block hover:text-blue-500 transition">About</a>
              <a href="#" className="block hover:text-blue-500 transition">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with GIF Background */}
      <section className="relative h-screen overflow-hidden">
        {/* GIF Background */}
        <img 
          src="/ouklfarjk9ib1.gif"
    alt="Background animation"
    className="absolute inset-0 w-full h-full object-cover"
    style={{ zIndex: 1 }}

        ></img>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">New Collection</h1>
            <p className="text-xl md:text-2xl mb-8">Limited Edition Drops</p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Products</h2>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-800 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-500 mb-4">${product.price}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">Premium quality merchandise for true fans.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white">Sale</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BrandMerch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}