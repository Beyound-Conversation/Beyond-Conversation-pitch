'use client';
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, Loader2 } from 'lucide-react';

export default function StripePaymentForm({ price }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect to a success page or back to access-pass
        return_url: `${window.location.origin}/access-pass?status=success`,
      },
    });

    // This is reached only if an error occurs (e.g. card declined)
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      
      {message && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {message}
        </div>
      )}

      <div className="pt-6 border-t border-white/10">
        <div className="flex justify-between items-center mb-6 text-sm">
           <span className="text-white/60">Total to pay:</span>
           <span className="text-2xl font-black text-brand-orange">${price}</span>
        </div>

        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(255,95,0,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
}