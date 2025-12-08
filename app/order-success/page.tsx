"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<{ 
    order_number: string; 
    customer_email: string; 
    total_amount: number; 
    payment_method: string;
    order_items: Array<{ product_name: string; color: string; size: string; price: number }> 
  } | null>(null);

  useEffect(() => {
    // Obtener el número de orden guardado
    const savedOrderNumber = localStorage.getItem('pending_order_number');
    if (savedOrderNumber) {
      setOrderNumber(savedOrderNumber);
      localStorage.removeItem('pending_order_number');
    }

    // Si hay session_id de Stripe, verificar el pago
    if (sessionId) {
      verifyStripePayment(sessionId);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  const verifyStripePayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={{fontFamily: 'Courier New, monospace'}}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: 'Courier New, monospace'}}>
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="text-2xl font-bold">
              Güero<span className="text-red-600">Gucci</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">
            Thank you for your purchase!
          </p>

          {/* Order Number */}
          {orderNumber && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-400 mb-2">Your Order Number</p>
              <p className="text-3xl font-bold font-mono text-red-600">{orderNumber}</p>
              <p className="text-sm text-gray-400 mt-4">
                Save this number for tracking your order
              </p>
            </div>
          )}

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span>{orderDetails.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-bold text-green-400">${orderDetails.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="capitalize">{orderDetails.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">Processing</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">What&apos;s Next?</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Confirmation Email Sent</span>
                  <p className="text-sm">Check your inbox for order details and receipt</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Processing Your Order</span>
                  <p className="text-sm">Your order is being prepared for shipment</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Shipping Updates</span>
                  <p className="text-sm">You&apos;ll receive tracking info via email within 24-48 hours</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalog"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Back to Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 mb-4">
              Need help with your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:support@guerogucci.com" className="text-red-600 hover:text-red-400 transition">
                📧 Email Support
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a href="#" className="text-red-600 hover:text-red-400 transition">
                💬 Live Chat
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a href="#" className="text-red-600 hover:text-red-400 transition">
                📞 Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 Güero<span className="text-red-600">Gucci</span>. All rights reserved.</p>
            <p className="mt-2">Thank you for supporting our brand! 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}