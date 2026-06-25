import Link from "next/link";

const ANDROID_URL = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
const IOS_URL = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export default function AppStoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link
        href={IOS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white border border-cw-border hover:border-cw-green transition"
      >
        <span className="text-2xl"></span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] text-cw-text-dim">Download on the</span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </Link>
      <Link
        href={ANDROID_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white border border-cw-border hover:border-cw-green transition"
      >
        <span className="text-2xl">▶</span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] text-cw-text-dim">Get it on</span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
