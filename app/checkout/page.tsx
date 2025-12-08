"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [fadeIn, setFadeIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.address_components) {
        let streetNumber = '';
        let route = '';
        let city = '';
        let state = '';
        let zipCode = '';

        place.address_components.forEach((component) => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const fullAddress = `${streetNumber} ${route}`.trim();

        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          city: city,
          state: state,
          zipCode: zipCode
        }));

        // Limpiar errores de los campos autocompletados
        setErrors((prev) => ({
          ...prev,
          address: '',
          city: '',
          state: '',
          zipCode: ''
        }));
      }
    }
  };

  const shippingCost = 10;
  const tax = getTotalPrice() * 0.08;
  const total = getTotalPrice() + shippingCost + tax;

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_phone: formData.phone,
            shipping_address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            },
            items: cart,
            totals: {
              subtotal: getTotalPrice(),
              shipping_cost: shippingCost,
              tax: tax,
              total: total,
            },
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Guardar el número de orden para la página de éxito
      localStorage.setItem('pending_order_number', data.orderNumber);
      
      // Limpiar el carrito antes de redirigir
      clearCart();

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={{fontFamily: 'Courier New, monospace'}}>
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/catalog" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-black text-white transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{fontFamily: 'Courier New, monospace'}}
    >
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <div className="flex justify-start">
              <Link 
                href="/cart"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
              >
                ← Back to Cart
              </Link>
            </div>
            <div className="flex justify-center text-2xl font-bold">
              Güero<span className="text-red-600">Gucci</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact & Shipping Information */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Contact & Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.firstName ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.lastName ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.email ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Address * 
                    {isLoaded && (
                      <span className="text-gray-400 text-xs ml-2">
                        (Start typing to search)
                      </span>
                    )}
                  </label>
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete;
                      }}
                      onPlaceChanged={onPlaceChanged}
                      options={{
                        componentRestrictions: { country: ['us', 'mx', 'ca'] },
                        fields: ['address_components', 'formatted_address'],
                        types: ['address']
                      }}
                    >
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Start typing your address..."
                        className={`w-full bg-gray-800 border ${errors.address ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className={`w-full bg-gray-800 border ${errors.address ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                    />
                  )}
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.city ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.state ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.zipCode ? 'border-red-600' : 'border-gray-700'} rounded px-4 py-3 focus:outline-none focus:border-red-600`}
                  />
                  {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Payment</h2>
              <p className="text-gray-400 text-sm mb-6">
                You&apos;ll be redirected to Stripe&apos;s secure checkout page to complete your payment.
              </p>
              
              {/* Security Badges */}
              <div className="flex items-center gap-4 mb-6 text-gray-400 text-xs">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>PCI DSS Compliant</span>
                </div>
              </div>

              {/* Checkout Button - Stripe Official Style */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`
                  w-full py-4 px-6 rounded-md font-medium text-base
                  transition-all duration-200 ease-in-out
                  ${isProcessing
                    ? 'bg-gray-600 cursor-not-allowed opacity-60'
                    : 'bg-[#635BFF] hover:bg-[#5851E8] active:bg-[#4D46D6] shadow-md hover:shadow-lg'
                  }
                  text-white
                  focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:ring-offset-2 focus:ring-offset-gray-900
                `}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    {/* Stripe Logo Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-2.704 0-5.284-1.043-6.976-1.951l-.84 5.494C5.644 23.078 8.375 24 11.788 24c2.585 0 4.664-.654 6.207-1.959 1.575-1.305 2.467-3.178 2.467-5.346 0-4.095-2.585-5.787-6.486-7.544z"/>
                    </svg>
                    Pay ${total.toFixed(2)}
                  </span>
                )}
              </button>

              {/* Stripe Badge */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-gray-500 text-xs">Secured by</span>
                <svg className="h-5 w-auto" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#635BFF"/>
                </svg>
              </div>
              
              <p className="text-center text-gray-500 text-xs mt-3">
                Your payment information is processed securely. We do not store credit card details.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.color} | {item.size}</p>
                      <p className="text-sm font-bold text-red-600">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="space-y-3 text-gray-400 text-xs">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                    </svg>
                    <span>Free Shipping on Orders $50+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd"/>
                    </svg>
                    <span>Easy Returns within 30 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}