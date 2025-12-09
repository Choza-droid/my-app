"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './lib/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
}

export default function MerchStore() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  const { cart, addToCart } = useCart();
  const router = useRouter();

  // Scroll to top when component mounts or page reloads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Also ensure scroll to top on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push('/catalog');
    }, 500);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const products = [
    {
      id: 1,
      name: "Gorra Negra Güero Gucci",
      price: 28,
      image: "/gorra_negra.jpg",
      colors: ['Negro'],
      sizes: ['Unitalla']
    },
    {
      id: 2,
      name: "Gorra Blanca Güero Gucci",
      price: 28,
      image: "/gorra_blanca.jpg",
      colors: ['Blanco'],
      sizes: ['Unitalla']
    },
    {
      id: 3,
      name: "Playera Negra Güero Gucci",
      price: 50,
      image: "/playera_negra.jpg",
      colors: ['Negro'],
      sizes: ['S', 'M', 'L']
    },
    {
      id: 4,
      name: "Playera Blanca Güero Gucci",
      price: 50,
      image: "/playera_blanca.jpg",
      colors: ['Blanco'],
      sizes: ['S', 'M', 'L']
    }
  ];

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor('');
    setSelectedSize('');
  };

  // Handle body overflow when modal opens/closes
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
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
              <Link 
                href="/" 
                onClick={handleHomeClick}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
              >
                Home
              </Link>
            </div>

            {/* Logo - Center */}
            <div className="flex justify-center text-2xl font-bold">
              Güero<span className="text-red-600">Gucci</span>
            </div>

            {/* Cart Icon - Right */}
            <div className="flex justify-end items-center space-x-4">
              {cart.length > 0 ? (
                <Link 
                  href="/cart" 
                  onClick={handleCartClick}
                  className="relative hover:text-red-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                </Link>
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
              <a href="#" className="block hover:text-red-600 transition">Tienda</a>
              <a href="#" className="block hover:text-red-600 transition">Acerca de</a>
              <a href="#" className="block hover:text-red-600 transition">Contacto</a>
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
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Nueva Colección</h1>
            <p className="text-xl md:text-2xl mb-8">Edición Limitada</p>
            <button 
              onClick={handleShopNowClick}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Supreme Style */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center px-4">Productos Destacados</h2>
        
        {/* Desktop: Centered horizontal strips with scrollbar when needed */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto px-4">
            <div 
              className="flex flex-row h-[600px] overflow-x-auto gap-1 justify-center"
              style={{scrollbarWidth: 'thin'}}
            >
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="relative shrink-0 group cursor-pointer"
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
              className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer"
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
                <p className="text-lg font-bold text-red-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="bg-zinc-800 border-zinc-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10" onClick={(e) => e.stopPropagation()}>
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
                              : 'bg-zinc-500 border-zinc-600 hover:border-red-600'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Talla</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded border transition ${
                            selectedSize === size 
                              ? 'bg-red-600 border-red-600 text-white' 
                              : 'bg-zinc-500 border-zinc-600 hover:border-red-600'
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
                        ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {!selectedColor || !selectedSize ? 'Selecciona Color y Talla' : 'Agregar al Carrito'}
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
              <h3 className="text-xl font-bold mb-4">Acerca de Nosotros</h3>
              <p className="text-gray-400">Mercancía de calidad premium para verdaderos fans.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Tienda</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Nuevos Productos</a></li>
                <li><a href="#" className="hover:text-white">Más Vendidos</a></li>
                <li><a href="#" className="hover:text-white">Ofertas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contáctanos</a></li>
                <li><a href="#" className="hover:text-white">Envíos</a></li>
                <li><a href="#" className="hover:text-white">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Güero Gucci. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}