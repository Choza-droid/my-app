"use client";

import { useState } from 'react';

export default function MerchStore() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Array<any>>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const products = [
    {
      id: 1,
      name: "Tiger Stripe Hoodie",
      price: 65,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: "Lion Pride T-Shirt",
      price: 35,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      colors: ['Black', 'White', 'Red'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 3,
      name: "Panther Black Hoodie",
      price: 70,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      colors: ['Black', 'Navy', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 4,
      name: "Wolf Pack Polo",
      price: 45,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      colors: ['White', 'Blue', 'Black'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 5,
      name: "Eagle Flight Jacket",
      price: 85,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      colors: ['Black', 'Brown', 'Green'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 6,
      name: "Shark Bite Tee",
      price: 30,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    }
  ];

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setSelectedColor('');
    setSelectedSize('');
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
  };

  const addToCart = () => {
    if (selectedProduct && selectedColor && selectedSize) {
      setCart([...cart, { ...selectedProduct, color: selectedColor, size: selectedSize }]);
      closeModal();
    }
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
        />

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

      {/* Featured Products Section - Supreme Style */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center px-4">Featured Products</h2>
        
        {/* Desktop: Horizontal strips centered with scrollbar */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-row h-[600px] overflow-x-auto gap-1" style={{scrollbarWidth: 'thin'}}>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="relative flex-shrink-0 group cursor-pointer"
                  style={{ width: '180px' }}
                  onClick={() => openProductModal(product)}
                >
                  {/* Vertical Product Strip */}
                  <div className="relative h-full overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Grid Layout */}
        <div className="md:hidden grid grid-cols-2 gap-4 px-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openProductModal(product)}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-800 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-blue-500">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="float-right text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <p className="text-3xl font-bold text-blue-500 mb-6">${selectedProduct.price}</p>

                  {/* Color Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Color</label>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded border ${
                            selectedColor === color 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Size</label>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded border ${
                            selectedSize === size 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={addToCart}
                    disabled={!selectedColor || !selectedSize}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                      selectedColor && selectedSize
                        ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!selectedColor || !selectedSize ? 'Select Color & Size' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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