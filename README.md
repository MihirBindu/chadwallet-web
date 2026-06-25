# ChadWallet Web

A marketing landing page plus a full mobile-style trading app flow for **ChadWallet**, a
Solana memecoin wallet. Built with Next.js (App Router), Tailwind CSS, Privy auth,
lightweight-charts, and a Codex.io/Jupiter-backed data layer.

**Live:** https://chadwallet-web-xi.vercel.app
**Mobile apps:** [iOS](https://apps.apple.com/us/app/chadwallet/id6757367474) · [Android](https://play.google.com/store/apps/details?id=xyz.chadwallet.www)

## What's here

### Landing page (`/`)
- Hero, rotating token banners (top + bottom — tapping a token opens its trading view),
  five feature sections with real phone-frame UI mockups (deposit, KOL feed, top traders,
  launch-a-coin, assets), and app store badges linking to the real listings.
- Sign in with Google/Apple via [Privy](https://privy.io) from the header.

### App flow (`/app/*`)
A mobile-app-shaped experience with a bottom tab bar (Home / Memes / Discover / Account):

| Route | What it does |
| --- | --- |
| `/app/home` | Live / KOLs / Memecoin / Trending tabs — trending tokens, KOL buy/sell feed, meme-tweet cards with inline Buy, plus a "Launch your own meme coin" entry point |
| `/app/token/[address]` | Token detail: market cap, 24h change, Movers/Trades toggle, live price chart, price range bar, timeframe tabs, contract/site chips. Shows **Your position** (qty/value/PnL) with Buy/Sell if you hold the token, or amount presets + keypad + Buy if you don't |
| `/app/token/[address]/research` | Top Holders / Top Traders / Bubblemap |
| `/app/account` | Balance + chart, Send/Receive/Deposit/Withdraw, rewards (claimed/creator/referral), holdings list — shown only when signed in |
| `/app/deposit`, `/app/withdraw`, `/app/send/[address]` | Big-amount entry screens with a numeric keypad and SOL/USD conversion |
| `/app/launch` | Two-step meme coin launch: image/name/ticker/social form → acquire-amount + Launch Coin |
| `/trade/[address]` | A separate desktop-oriented trading layout (trending list / chart+holders+trades / buy-sell panel side by side) |

### Auth
- `src/lib/AuthContext.tsx` + `src/components/AuthProvider.tsx` wrap Privy in a single
  `useAuth()` hook (`ready`, `authenticated`, `login`, `logout`, `requireAuth`,
  `walletAddress`, `walletPending`, `error`) so every screen shares one source of truth.
- Successful sign-in redirects to `/app/home` — but only for a real sign-in action, not for
  users who were already authenticated when a page loaded.
- Every money-moving action (Buy, Sell, Deposit, Withdraw, Send, Launch Coin) calls
  `requireAuth()` first: signed-out users get the Privy login modal instead of the action
  silently failing. Browsing (charts, lists, research) never requires auth.
- An embedded Solana wallet is created automatically on first login
  (`embeddedWallets.solana.createOnLogin`); the Account screen shows "Creating wallet..."
  until it's ready, then the wallet's short address.
- Cancelling the OAuth popup is treated as a no-op, not an error. Real auth failures surface
  as a small inline message under the Sign In button.
- If `NEXT_PUBLIC_PRIVY_APP_ID` isn't set, every entry point falls back to an explanatory
  alert instead of crashing.

## Data sources

Everything falls back to realistic mock data when API keys aren't set, so the app is fully
functional out of the box. Set these env vars to go live:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | [Privy](https://dashboard.privy.io) app ID — real Google/Apple sign-in + embedded Solana wallets |
| `CODEX_API_KEY` | [Codex.io](https://docs.codex.io) — live trending token data |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | [Alchemy Solana RPC](https://www.alchemy.com/rpc-api) — on-chain reads |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase — optional persistence |

Swap quotes are fetched live from [Jupiter](https://developers.jup.ag/docs/get-started)'s
public quote API (no key required). Actually executing a swap, deposit/withdraw, or coin
launch needs a signed transaction from the connected wallet — those buttons are wired and
auth-gated, but the on-chain transaction step is the natural next increment.

Copy `.env.example` to `.env.local` and fill in what you have.

## Project structure

```
src/
  app/
    page.tsx                 # landing page
    app/                     # mobile-style app flow (see table above)
    api/                     # tokens, feed, token detail, position, research, account
    trade/[address]/         # desktop trading layout
  components/
    app/                     # screens + shared UI for the /app flow (keypad, tabs, etc.)
    AuthProvider.tsx          # Privy wiring + redirect/error/wallet logic
    FeatureMockups.tsx        # phone-frame mockups used on the landing page
  lib/
    AuthContext.tsx           # useAuth() hook
    tokens.ts, mock.ts        # data layer (Codex.io live, mock fallback)
    jupiter.ts, format.ts
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the landing page, or http://localhost:3000/app/home for the
app flow directly.

## Deploy

Deployed on [Vercel](https://vercel.com), connected to this GitHub repo — pushes to `main`
redeploy automatically. To deploy manually:

```bash
npx vercel deploy --prod
```
