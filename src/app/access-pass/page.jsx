'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StripePaymentForm from '../../components/StripePaymentForm';
import { Check, CreditCard, Globe, Lock, Loader2, Download, ArrowRight, Sparkles, Calendar, Mail, Ticket } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const plans = [
  { id: 'monthly', label: 'Monthly', price: 1, period: '/mo', desc: 'Flexible access, cancel anytime.' },
  { id: 'biannual', label: '6 Months', price: 6, period: '/6mo', desc: 'Commit to the journey. Save nothing, gain focus.' },
  { id: 'annual', label: 'Annual', price: 12, period: '/yr', desc: 'The full 12-topic curriculum. Best value.' },
];

function AccessPassContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const queryEmail = searchParams.get('email');
  const queryPlanId = searchParams.get('plan');

  const [selectedPlan, setSelectedPlan] = useState(plans[2]);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [ticketId, setTicketId] = useState('');

  // Generate random Ticket ID on mount for success view
  useEffect(() => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTicketId(`BC-2026-${rand}`);
  }, []);

  // Save success state to localStorage when redirected
  useEffect(() => {
    if (status === 'success' && queryEmail) {
      localStorage.setItem('beyond_conversation_access_pass', 'true');
      localStorage.setItem('beyond_conversation_email', queryEmail);
      if (queryPlanId) {
        localStorage.setItem('beyond_conversation_plan', queryPlanId);
      }
    }
  }, [status, queryEmail, queryPlanId]);

  // Reset client secret when plan, email or method changes to prevent stale intents
  useEffect(() => {
    setClientSecret("");
  }, [selectedPlan, email, paymentMethod]);

  const handlePrepareStripe = async (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Please enter a valid email address');

    setLoading(true);
    try {
      const res = await fetch("/api/payment/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: selectedPlan.price * 100, 
          email: email 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create intent");
      
      setClientSecret(data.clientSecret);
    } catch (err) {
      alert(`Stripe Initialization Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    setLoading(true);
    try {
      const PaystackPop = (await import('@paystack/inline-js')).default;

      const res = await fetch('/api/payment/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: selectedPlan.price * 1500 * 100, // Amount in kobo (Kobo value relative to USD/local rates)
          plan: selectedPlan
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const popup = new PaystackPop();
      popup.resumeTransaction(data.access_code, {
        onSuccess: (transaction) => {
          // Redirect on successful Paystack payment
          window.location.href = `/access-pass?status=success&email=${encodeURIComponent(email)}&plan=${encodeURIComponent(selectedPlan.id)}`;
        },
        onCancel: () => {
          alert('Payment cancelled.');
        },
        onError: (err) => {
          alert(`Paystack popup error: ${err.message}`);
        }
      }); 

    } catch (error) {
      alert(`Payment Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Please enter a valid email address');
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

  // SUCCESS STATE VIEW
  if (status === 'success') {
    const successPlan = plans.find(p => p.id === queryPlanId) || selectedPlan;
    
    return (
      <main className="min-h-screen bg-brand-dark text-white selection:bg-brand-orange selection:text-white flex flex-col justify-between">
        <Navbar />
        
        <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto w-full flex-grow flex flex-col justify-center items-center">
          
          {/* Glowing Green Success Pulse Badge */}
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-6 relative">
            <Check size={28} className="relative z-10" />
            <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-center mb-2">Access Pass Activated</h1>
          <p className="text-white/60 text-center text-sm mb-12">
            Your seat is secure. Print or save your digital pass below.
          </p>

          {/* HIGH FIDELITY TICKET */}
          <div className="w-full max-w-md glass border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            {/* Top decorative gradient bar */}
            <div className="h-2 bg-linear-to-r from-brand-orange via-orange-500 to-amber-500" />
            
            {/* Ticket Header */}
            <div className="p-8 pb-6 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/20">
                  Member Ticket
                </span>
                <h3 className="text-xl font-black mt-3 text-white tracking-tighter">
                  BEYOND<span className="text-brand-orange">CONVERSATION</span>
                </h3>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-[9px] uppercase tracking-widest">Season</p>
                <p className="text-xs font-bold text-white/80">2026 Launch</p>
              </div>
            </div>

            {/* Middle Ticket Divider with circular notches */}
            <div className="relative h-px bg-dashed bg-white/15 my-2">
              <div className="absolute -left-3.5 -top-3 w-7 h-7 rounded-full bg-brand-dark border-r border-white/10" />
              <div className="absolute -right-3.5 -top-3 w-7 h-7 rounded-full bg-brand-dark border-l border-white/10" />
            </div>

            {/* Ticket Details */}
            <div className="p-8 pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Attendee</p>
                  <p className="text-sm font-bold text-white/90 truncate flex items-center gap-1.5">
                    <Mail size={12} className="text-brand-orange" /> {queryEmail}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Pass Tier</p>
                  <p className="text-sm font-bold text-white/90 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-brand-orange" /> {successPlan.label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Access Type</p>
                  <p className="text-sm font-bold text-white/90 flex items-center gap-1.5">
                    <Ticket size={12} className="text-brand-orange" /> Full Stage Access
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Validity</p>
                  <p className="text-sm font-bold text-white/90 flex items-center gap-1.5">
                    <Calendar size={12} className="text-brand-orange" /> Jan - Dec 2026
                  </p>
                </div>
              </div>

              {/* Barcode and Ticket ID */}
              <div className="pt-6 border-t border-white/10 text-center">
                {/* Simulated digital barcode */}
                <div className="flex justify-center items-center gap-0.5 h-10 bg-white/2 rounded-lg p-2 overflow-hidden w-full max-w-[240px] mx-auto mb-3">
                  {[2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-white/40" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <p className="text-xs font-mono tracking-widest text-white/50">{ticketId}</p>
              </div>
            </div>
          </div>

          {/* Ticket actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
            <a 
              href="/#live"
              className="bg-brand-orange hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all active:scale-95 text-sm uppercase tracking-wider"
            >
              Enter Live Stage <ArrowRight size={16} />
            </a>
            <a
              href="/syllabus.pdf"
              download="Beyond_Conversation_Syllabus.pdf"
              className="glass hover:bg-white/5 border-white/10 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider"
            >
              <Download size={16} /> Syllabus (PDF)
            </a>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // STANDARD CHECKOUT VIEW
  return (
    <main className="min-h-screen bg-brand-dark text-white selection:bg-brand-orange selection:text-white flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">Secure Your Seat</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Join the inner circle. Full access to live sessions, recordings, and the community archives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Step 1: Select Duration */}
          <div className="space-y-6">
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

          {/* Step 2: Payment Details */}
          <div className="glass-card p-8 rounded-4xl min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">2</span>
              Payment Method
            </h3>

            {/* Email Address Input */}
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

            {/* Payment Method Selector */}
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

            {/* --- PAYSTACK FORM --- */}
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
              /* --- STRIPE FORM (Keystroke-Safe) --- */
              <div className="pt-6 border-t border-white/10">
                {!email ? (
                  <div className="text-center py-10 text-white/40">Please enter your email to initialize Stripe</div>
                ) : clientSecret ? (
                  <Elements options={{ clientSecret, appearance: stripeAppearance }} stripe={stripePromise}>
                    <StripePaymentForm price={selectedPlan.price} email={email} planId={selectedPlan.id} />
                  </Elements>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-white/60">Total to pay:</span>
                      <span className="text-2xl font-black text-brand-orange">${selectedPlan.price}</span>
                    </div>
                    <button
                      onClick={handlePrepareStripe}
                      disabled={loading}
                      className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(255,95,0,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                      {loading ? "Initializing..." : "Proceed to Card Payment"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function AccessPassPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-dark text-white flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
        <p className="mt-4 text-white/50 tracking-wider uppercase font-bold text-xs">Loading Checkout...</p>
      </main>
    }>
      <AccessPassContent />
    </Suspense>
  );
}