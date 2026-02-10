import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            <span className="text-lg font-semibold text-white">TowerHQ</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="https://github.com/Substr8-Labs" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="https://discord.gg/clawd" className="hover:text-white transition-colors">
              Discord
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 Substr8 Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
