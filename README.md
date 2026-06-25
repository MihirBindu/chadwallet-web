# ChadWallet Web

Landing page + live trading view for ChadWallet, a Solana memecoin wallet/trading app.
Built with Next.js (App Router), Tailwind CSS, Privy auth, and lightweight-charts.

## Features

- Landing page mirroring the ChadWallet app screens (secure deposits, KOL/trade feed, top
  traders, one-tap memecoin launch, portfolio tracking).
- Rotating token banners (top + bottom) — tapping a token opens its trading view.
- Sign in with Google/Apple via [Privy](https://privy.io), with an embedded Solana wallet
  created automatically on first login.
- `/trade/[address]`: trending list (left), token info + live price chart + holders + live
  trades (middle), buy/sell panel + position (right).
- Mobile app links wired to the real App Store / Google Play listings.

## Data sources

All data falls back to realistic mock data when API keys are not set, so the app is fully
functional out of the box. Set these env vars to go live:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID — enables real Google/Apple sign-in |
| `CODEX_API_KEY` | [Codex.io](https://docs.codex.io) — live trending token data |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | [Alchemy Solana RPC](https://www.alchemy.com/rpc-api) — on-chain reads |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase — optional persistence |

Swap quotes are fetched live from [Jupiter](https://developers.jup.ag/docs/get-started)'s
public quote API (no key required); executing a swap requires a connected Privy wallet and
is the natural next step once auth is fully wired with real keys.

Copy `.env.example` to `.env.local` and fill in what you have.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Deployed on [Vercel](https://vercel.com). Any push to `main` redeploys automatically once the
repo is connected to a Vercel project.
