import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// ❌ OLD CODE: This was causing the crash
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export async function POST(request) {
  try {
    // ✅ NEW CODE: Initialize Stripe INSIDE the function
    // This makes the build completely safe!
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const { amount, email } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}