'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StripePaymentForm from '../../components/StripePaymentForm';
import { Check, CreditCard, Globe, Lock, Loader2 } from 'lucide-react';
// ❌ REMOVED: import PaystackPop from '@paystack/inline-js'; (This caused the crash)
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const plans = [
  { id: 'monthly', label: 'Monthly', price: 1, period: '/mo', desc: 'Flexible access, cancel anytime.' },
  { id: 'biannual', label: '6 Months', price: 6, period: '/6mo', desc: 'Commit to the journey. Save nothing, gain focus.' },
  { id: 'annual', label: 'Annual', price: 12, period: '/yr', desc: 'The full 12-topic curriculum. Best value.' },
];

export default function AccessPassPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[2]);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (paymentMethod === 'stripe' && email) {
      setLoading(true);
      fetch("/api/payment/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: selectedPlan.price * 100, 
          email: email 
        }),
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .finally(() => setLoading(false));
    }
  }, [paymentMethod, selectedPlan, email]);

  const handlePaystackPayment = async () => {
    setLoading(true);
    try {
      // ✅ FIX: Dynamically import Paystack only when needed (on the client)
      const PaystackPop = (await import('@paystack/inline-js')).default;

      const res = await fetch('/api/payment/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: selectedPlan.price * 1500 * 100,
          plan: selectedPlan
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const popup = new PaystackPop();
      popup.resumeTransaction(data.access_code); 

    } catch (error) {
      alert(`Payment Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address');
    handlePaystackPayment();
  };

  const stripeAppearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#ff5f00',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  return (
    <main className="min-h-screen bg-brand-dark text-white selection:bg-brand-orange selection:text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <h1 className="text-5xl md:text-6xl font-black mb-6">Secure Your Seat</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Join the inner circle. Full access to live sessions, recordings, and the community archives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-6 reveal delay-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-orange text-black flex items-center justify-center text-xs font-bold">1</span>
              Select Duration
            </h3>
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`cursor-pointer relative p-6 rounded-3xl border transition-all duration-300 flex justify-between items-center group ${
                    selectedPlan.id === plan.id 
                      ? 'bg-brand-orange/10 border-brand-orange shadow-[0_0_30px_rgba(255,95,0,0.1)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-lg">{plan.label}</h4>
                      {selectedPlan.id === plan.id && <Check size={16} className="text-brand-orange" />}
                    </div>
                    <p className="text-white/40 text-sm mt-1">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black">${plan.price}</span>
                    <span className="text-white/40 text-xs">{plan.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-4xl reveal delay-200 min-h-125">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">2</span>
              Payment Method
            </h3>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uzoh@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setPaymentMethod('paystack')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'paystack'
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                    : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <CreditCard size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Paystack</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                    : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <Globe size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Stripe</span>
              </button>
            </div>

            {paymentMethod === 'paystack' ? (
              <form onSubmit={handlePaystackSubmit}>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-white/60">Total to pay:</span>
                    <span className="text-2xl font-black text-brand-orange">${selectedPlan.price}</span>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(255,95,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} 
                    {loading ? 'Processing...' : 'Pay with Paystack'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {!email ? (
                  <div className="text-center py-10 text-white/40">Please enter your email to load Stripe</div>
                ) : clientSecret ? (
                  <Elements options={{ clientSecret, appearance: stripeAppearance }} stripe={stripePromise}>
                    <StripePaymentForm price={selectedPlan.price} />
                  </Elements>
                ) : (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/50" /></div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}