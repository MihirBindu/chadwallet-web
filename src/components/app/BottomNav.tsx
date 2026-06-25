"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/app/home", label: "Home", icon: "🏠" },
  { href: "/app/home?tab=memecoin", label: "Memes", icon: "✨" },
  { href: "/app/home?tab=trending", label: "Discover", icon: "🧭" },
  { href: "/app/account", label: "Account", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 border-t border-cw-border bg-cw-navy/95 backdrop-blur px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {ITEMS.map((item) => {
          const isActive = item.href.includes("account")
            ? pathname.startsWith("/app/account")
            : item.href === "/app/home" && pathname.startsWith("/app/home");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-xs ${
                isActive ? "text-cw-green" : "text-cw-text-dim"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
