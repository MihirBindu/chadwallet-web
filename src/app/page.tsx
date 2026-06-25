import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import TokenBanner from "@/components/TokenBanner";
import AppStoreBadges from "@/components/AppStoreBadges";
import SignInButton from "@/components/SignInButton";
import PhoneFrame from "@/components/PhoneFrame";
import {
  DepositMockup,
  KolFeedMockup,
  TopTraderMockup,
  LaunchCoinMockup,
  AssetsMockup,
} from "@/components/FeatureMockups";

const FEATURES = [
  {
    title: "Secure deposits & instant withdrawals",
    body: "You own your crypto. It is safe and untouchable.",
    Mockup: DepositMockup,
  },
  {
    title: "Take the guesswork out of trading",
    body: "Monitor large trades and top traders, see their moves in real-time.",
    Mockup: KolFeedMockup,
  },
  {
    title: "Meet top traders who win consistently",
    body: "Follow winning strategies, grow your profit with confidence.",
    Mockup: TopTraderMockup,
  },
  {
    title: "Launch memecoins in one tap",
    body: "Turn memes, viral tweets, or your own ideas into coins instantly.",
    Mockup: LaunchCoinMockup,
  },
  {
    title: "Track your assets in one place",
    body: "Watch your holdings, memes, and rewards in realtime.",
    Mockup: AssetsMockup,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TokenBanner />
      <Header />

      <section className="cw-hero-gradient text-cw-navy">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Secure deposits &amp; instant withdrawals
            </h1>
            <p className="text-lg mb-8 text-cw-navy/80">
              You own your crypto. It is safe and untouchable. Trade Solana memecoins,
              follow top traders, and launch your own coin in one tap.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <SignInButton />
              <Link
                href="/app/home"
                className="rounded-full border border-cw-navy/30 px-6 py-3 font-semibold hover:bg-cw-navy/10 transition"
              >
                Open trading view
              </Link>
            </div>
            <AppStoreBadges className="mt-8" />
          </div>
          <div className="flex justify-center">
            <Image
              src="/brand/logo-mark.svg"
              alt="ChadWallet"
              width={220}
              height={220}
              className="rounded-3xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="max-w-xs mx-auto w-full">
              <PhoneFrame>
                <f.Mockup />
              </PhoneFrame>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">{f.title}</h2>
              <p className="text-cw-text-dim text-lg">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="trending" className="max-w-6xl mx-auto px-6 py-10 w-full">
        <h2 className="text-2xl font-bold mb-2">Trending on Solana</h2>
        <p className="text-cw-text-dim mb-4">Tap any token to open the live trading view.</p>
      </section>
      <TokenBanner reverse />

      <section id="download" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Get ChadWallet</h2>
        <p className="text-cw-text-dim mb-8">Available now on iOS and Android.</p>
        <div className="flex justify-center">
          <AppStoreBadges />
        </div>
      </section>

      <footer className="border-t border-cw-border py-8 text-center text-sm text-cw-text-dim">
        © {new Date().getFullYear()} ChadWallet. Built on Solana.
      </footer>
    </div>
  );
}
