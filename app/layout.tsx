import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RED PROTOCOL | Noir Christmas Investigation",
  description: "A 3D noir investigation experience. The case file awaits.",
  keywords: ["noir", "investigation", "3D", "christmas", "mystery"],
  authors: [{ name: "Red Protocol Unit" }],
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} font-mono antialiased bg-slate-950 text-slate-200 overflow-hidden`}
      >
        {/* Subtle noise overlay for the entire app */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Main content */}
        <main className="relative w-screen h-screen">
          {children}
        </main>

        {/* Scanline effect overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-40 opacity-[0.03]"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.3) 2px,
              rgba(0, 0, 0, 0.3) 4px
            )`,
          }}
        />
      </body>
    </html>
  );
}

