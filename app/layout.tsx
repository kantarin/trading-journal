import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TradeProvider } from "@/context/trade-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "Track and analyze your trading performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        <TradeProvider>
          {children}
        </TradeProvider>
      </body>
    </html>
  );
}
