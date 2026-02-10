import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TowerHQ - Your AI Executive Team",
  description: "Get instant strategic guidance from AI personas who think like a CTO, CPO, CMO, and CFO. Stop making decisions alone.",
  keywords: ["AI", "startup", "founder", "executive team", "strategy", "CTO", "CPO", "CMO", "CFO"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
