import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, amount, plan } = await request.json();

    const params = {
      email,
      amount, // Amount in kobo (e.g., 1000 = 10 Naira)
      // callback_url: "http://localhost:3000/access-pass", // Optional: Redirect after payment
      metadata: {
        plan_id: plan.id,
        custom_fields: [
          { display_name: "Plan Name", variable_name: "plan_name", value: plan.label }
        ]
      }
    };

    // Call Paystack API (Server-to-Server)
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Securely uses Secret Key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // Return the access_code to the frontend
    return NextResponse.json({ access_code: data.data.access_code, reference: data.data.reference });

  } catch (error) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}