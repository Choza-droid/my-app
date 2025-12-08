"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/CartContext';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  const { cart, addToCart } = useCart();
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'hats', name: 'Hats' },
    { id: 't-shirts', name: 'T-Shirts' },
    { id: 'hoodies', name: 'Hoodies' },
    { id: 'pants', name: 'Pants' },
    { id: 'jackets', name: 'Jackets' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const allProducts = [
    // Hats
    {
      id: 1,
      name: "Tiger Stripe Cap",
      price: 45,
      category: 'hats',
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
      colors: ['Black', 'White', 'Red'],
      sizes: ['One Size'],
      soldOut: false
    },
    {
      id: 2,
      name: "Lion Pride Beanie",
      price: 35,
      category: 'hats',
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80",
      colors: ['Black', 'Gray'],
      sizes: ['One Size'],
      soldOut: true
    },
    // T-Shirts
    {
      id: 3,
      name: "Classic Logo Tee",
      price: 35,
      category: 't-shirts',
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      colors: ['Black', 'White', 'Red'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    {
      id: 4,
      name: "Vintage Logo Tee",
      price: 40,
      category: 't-shirts',
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
      colors: ['Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    {
      id: 5,
      name: "Street Art Tee",
      price: 38,
      category: 't-shirts',
      image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&q=80",
      colors: ['White', 'Black'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: true
    },
    // Hoodies
    {
      id: 6,
      name: "Tiger Stripe Hoodie",
      price: 65,
      category: 'hoodies',
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    {
      id: 7,
      name: "Panther Black Hoodie",
      price: 70,
      category: 'hoodies',
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      colors: ['Black', 'Navy', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    // Pants
    {
      id: 8,
      name: "Cargo Pants",
      price: 85,
      category: 'pants',
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
      colors: ['Black', 'Olive', 'Khaki'],
      sizes: ['28', '30', '32', '34', '36'],
      soldOut: false
    },
    {
      id: 9,
      name: "Denim Jeans",
      price: 95,
      category: 'pants',
      image: "https://images.unsplash.com/photo-1542272454315-7f6fabf531a8?w=500&q=80",
      colors: ['Blue', 'Black'],
      sizes: ['28', '30', '32', '34', '36'],
      soldOut: true
    },
    // Jackets
    {
      id: 10,
      name: "Eagle Flight Jacket",
      price: 120,
      category: 'jackets',
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      colors: ['Black', 'Brown', 'Green'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    {
      id: 11,
      name: "Bomber Jacket",
      price: 110,
      category: 'jackets',
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
      colors: ['Black', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      soldOut: false
    },
    // Accessories
    {
      id: 12,
      name: "Logo Backpack",
      price: 75,
      category: 'accessories',
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
      colors: ['Black', 'Gray'],
      sizes: ['One Size'],
      soldOut: false
    },
    {
      id: 13,
      name: "Chain Necklace",
      price: 55,
      category: 'accessories',
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
      colors: ['Silver', 'Gold'],
      sizes: ['One Size'],
      soldOut: true
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const openProductModal = (product: any) => {
    if (product.soldOut) return;
    setSelectedProduct(product);
    setSelectedColor('');
    setSelectedSize('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedColor && selectedSize) {
      const newItem = { 
        ...selectedProduct, 
        color: selectedColor, 
        size: selectedSize,
        cartId: Date.now()
      };
      addToCart(newItem);
      closeModal();
    }
  };

  return (
    <div 
      className={`min-h-screen bg-black text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{fontFamily: 'Courier New, monospace'}}
    >
      {/* Header/Navigation */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Home Button - Left */}
            <div className="flex justify-start">
              <button 
                onClick={handleHomeClick}
                className="bg-red-600 hover:bg-red-600 text-white px-6 py-2 rounded transition"
              >
                Home
              </button>
            </div>

            {/* Logo - Center */}
            <div className="flex justify-center text-2xl font-bold">
              Güero <span className="text-red-600">Gucci</span>
            </div>

            {/* Cart Icon - Right */}
            <div className="flex justify-end items-center space-x-4">
              {cart.length > 0 ? (
                <button onClick={handleCartClick} className="relative hover:text-red-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                </button>
              ) : (
                <div className="relative opacity-50 cursor-not-allowed">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              )}

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
              <Link href="/catalog" className="block hover:text-red-600 transition">Shop</Link>
              <a href="#" className="block hover:text-red-600 transition">About</a>
              <a href="#" className="block hover:text-red-600 transition">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Category Filter */}
      <div className="border-b border-gray-800 bg-black sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">
          {categories.find(c => c.id === selectedCategory)?.name}
        </h1>

        {/* Desktop View - Supreme Style (Image only with hover) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductModal(product)}
              className={`relative group overflow-hidden bg-gray-900 ${
                product.soldOut ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    product.soldOut ? 'opacity-60 grayscale' : 'group-hover:scale-105'
                  }`}
                />
              </div>

              {/* Hover Overlay - Desktop Only */}
              {product.soldOut && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-2xl font-bold text-red-600">SOLD OUT</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View - Image with Name and Sold Out Badge */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductModal(product)}
              className={`bg-gray-900 rounded-lg overflow-hidden ${
                product.soldOut ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-800 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover ${
                    product.soldOut ? 'opacity-60 grayscale' : ''
                  }`}
                />
                {product.soldOut && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SOLD OUT
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-red-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No products found in this category</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && !selectedProduct.soldOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10" onClick={(e) => e.stopPropagation()}>
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
                  <p className="text-3xl font-bold text-red-600 mb-6">${selectedProduct.price}</p>

                  {/* Color Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded border transition ${
                            selectedColor === color 
                              ? 'bg-red-600 border-red-600 text-white' 
                              : 'bg-gray-800 border-gray-700 hover:border-red-600'
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
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded border transition ${
                            selectedSize === size 
                              ? 'bg-red-600 border-red-600 text-white' 
                              : 'bg-gray-800 border-gray-700 hover:border-red-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedColor || !selectedSize}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                      selectedColor && selectedSize
                        ? 'bg-red-600 hover:bg-red-600 text-white cursor-pointer'
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
                <li><Link href="/catalog" className="hover:text-white">New Arrivals</Link></li>
                <li><Link href="/catalog" className="hover:text-white">Best Sellers</Link></li>
                <li><Link href="/catalog" className="hover:text-white">Sale</Link></li>
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
            <p>&copy; 2024 Güero Gucci. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}