// supabase/functions/create-razorpay-order/index.ts
//
// Deploy this into the SAME Supabase project the Mochi app already uses —
// one project, one bill, matches what you asked for.
//
// HOW TO DEPLOY (two options):
//   A) Supabase CLI:  supabase functions deploy create-razorpay-order
//   B) Dashboard:     Project → Edge Functions → Create a new function →
//                      paste this file in → Deploy
//
// BEFORE IT WILL WORK, set two secrets (Dashboard → Edge Functions → Secrets,
// or `supabase secrets set` from the CLI). These come from Razorpay's
// dashboard: Settings → API Keys.
//   RAZORPAY_KEY_ID       (same value you put in CONFIG.razorpayKeyId)
//   RAZORPAY_KEY_SECRET   (the one that must never appear in the site's code)
//
// Never paste RAZORPAY_KEY_SECRET into chat, a file, or the browser —
// only into the Secrets box above.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Browsers send a pre-flight OPTIONS request — always answer it first.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return new Response(
      JSON.stringify({ error: "Razorpay secrets not set on the server yet." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Missing or invalid amount");
    }

    // Razorpay wants the amount in the smallest currency unit — paise, not rupees.
    const amountInPaise = Math.round(amount * 100);

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt ?? `mochi_${Date.now()}`,
      }),
    });

    const order = await rzpRes.json();

    if (!rzpRes.ok) {
      throw new Error(order?.error?.description ?? "Razorpay order creation failed");
    }

    // order.id, order.amount, order.currency go straight to the browser —
    // this is exactly what the client needs to open Razorpay Checkout.
    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
