# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের বাজার দর দেখুন, বাজার অনুযায়ী তুলনা করুন।

## Technologies
Next.js 14 (App Router) · Tailwind CSS + DaisyUI · BetterAuth (+ MongoDB) · react-hot-toast

## Features
1. Sticky navbar with Bangla date, active category highlight, and auth buttons / profile menu
2. Infinite price ticker (marquee) with ▲/▼ change percentages in Bengali digits
3. Home sections: biggest risers, biggest fallers, and all products — responsive grids with skeleton loaders
4. Category pages with sorting (default / low→high / high→low, numeric-safe for Bengali numerals) and 404-style empty state
5. Protected product detail page with min / max / average price and per-market price breakdown
6. BetterAuth email/password + Google + GitHub login, toasts, protected routes
7. My Profile + Update Information (name) page

## Setup
```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI, BETTER_AUTH_SECRET, etc.
npm run dev
```
Social login needs Google / GitHub OAuth apps with callback URLs
`{BETTER_AUTH_URL}/api/auth/callback/google` and `/github`.

## Deploy (Vercel)
Add the same env vars in the project settings (set `BETTER_AUTH_URL` to your live URL). Dynamic routes
(`/category/[slug]`, `/product/[slug]`) work on refresh out of the box.
