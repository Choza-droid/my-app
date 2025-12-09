"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../lib/CartContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
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

    // IMPORTANTE: Limpiar el carrito SOLO cuando llegamos desde Stripe con session_id
    if (sessionId) {
      clearCart();
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
        setIsLoading(false);
      } else if (data.processing && retryCount < 5) {
        // El webhook aún está procesando - reintentar después de 2 segundos
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          verifyStripePayment(sessionId);
        }, 2000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setIsLoading(false);
    }
  };

  // Protección: Si no hay session_id, no permitir acceso
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={{fontFamily: 'Courier New, monospace'}}>
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-3xl font-bold mb-4">Acceso No Autorizado</h1>
          <p className="text-zinc-400 mb-6">Esta página solo es accesible después de completar un pago.</p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition inline-block">
            Ir al Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={{fontFamily: 'Courier New, monospace'}}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl">Verificando el pago...</p>
          {retryCount > 0 && (
            <p className="text-sm text-zinc-400 mt-2">Procesando orden... ({retryCount}/5)</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: 'Courier New, monospace'}}>
      {/* Header */}
      <header className="border-b border-zinc-800">
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
            ¡Orden Confirmada! 🎉
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8">
            ¡Gracias por tu compra!
          </p>

          {/* Order Number */}
          {(orderNumber || orderDetails?.order_number) && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
              <p className="text-sm text-zinc-400 mb-2">Tu Número de Orden</p>
              <p className="text-3xl font-bold font-mono text-red-600">
                {orderDetails?.order_number || orderNumber}
              </p>
              <p className="text-sm text-zinc-400 mt-4">
                Guarda este número para rastrear tu orden.
              </p>
            </div>
          )}

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold mb-4">Detalles de la Orden</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Email:</span>
                  <span>{orderDetails.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total:</span>
                  <span className="font-bold text-green-400">${orderDetails.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Método de Pago:</span>
                  <span className="capitalize">{orderDetails.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="text-green-400">Procesando</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">¿Qué sigue?</h2>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Confirmación Enviada a tu Correo</span>
                  <p className="text-sm">Revisa tu bandeja de entrada para ver los detalles de la orden y el recibo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Procesando tu Orden</span>
                  <p className="text-sm">Tu orden está siendo preparada para el envío</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                <div>
                  <span className="text-white font-semibold">Actualizaciones de Envío</span>
                  <p className="text-sm">Recibirás información de seguimiento por correo electrónico en un plazo de 24 a 48 horas</p>
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
              Continuar Comprando
            </Link>
            <Link 
              href="/"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-zinc-400 text-sm">
            <p>&copy; 2024 Güero Gucci. Todos los derechos reservados.</p>
            <p className="mt-2">¡Gracias por apoyar nuestra marca! 🙏</p>
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
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}