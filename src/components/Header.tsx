import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/brand/logo-mark.svg" alt="ChadWallet" width={32} height={32} />
        <span className="font-bold text-lg">ChadWallet</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm text-cw-text-dim">
        <Link href="/#trending" className="hover:text-foreground">Trending</Link>
        <Link href="/#features" className="hover:text-foreground">Features</Link>
        <Link href="/#download" className="hover:text-foreground">Download</Link>
      </nav>
      <SignInButton className="text-sm px-5 py-2" />
    </header>
  );
}
