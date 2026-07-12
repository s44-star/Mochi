/* ============================================================
   MOCHI — CONFIG
   This is the ONLY file you edit to go live.
   Change the values, commit to GitHub, redeploy. Done.
   ============================================================ */

window.APP_CONFIG = {
  APP_NAME: "Mochi",

  /* ---------------- SUPABASE ----------------
     Get these from Supabase > Project Settings > API */
  SUPABASE_URL:https://evwhcshconrresjhkwme.supabase.co ,
  SUPABASE_ANON_KEY: sb_publishable_CZjnAjgqUChYCo4NuH56_w_0vs5Q8Cj,

  /* ---------------- PAYMENTS ----------------
     Fiat = a hosted payment link (Razorpay / Stripe / etc.)
     Crypto = a hosted checkout URL, OR just a wallet to copy */

  // Fiat rail
  FIAT_PAYMENT_URL: https://rzp.io/rzp/WQrCWAV,
  FIAT_LABEL: "Card / UPI",
  PRICE_FIAT: "₹499",

  // Crypto rail
  CRYPTO_PAYMENT_URL: "",  // optional hosted crypto checkout; leave "" to show wallet instead
  CRYPTO_WALLET: UQAUQlA6Ak4uLoftyor4x3GYydupgCTf_Gqyv9Pz_F9poZUI
  CRYPTO_NETWORK: "TON",
  CRYPTO_LABEL: "Crypto",
  PRICE_CRYPTO: "1 TON",
};

/* ---------------- SUPABASE TABLE (optional) ----------------
   If you want to persist who unlocked premium, run this once
   in the Supabase SQL editor:

   create table if not exists unlocks (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users on delete cascade,
     method text,
     created_at timestamptz default now()
   );
   alter table unlocks enable row level security;
   create policy "own rows" on unlocks
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ------------------------------------------------------------ */
