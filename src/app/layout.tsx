import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Dock } from "@/components/shared/Dock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Swiper",
  description: "Swipe your next favorite movie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-foreground flex justify-center min-h-screen`}
      >
        {/* Mobile Container Simulation */}
        <div className="w-full max-w-[450px] bg-background min-h-dvh relative shadow-2xl overflow-hidden flex flex-col">
          <main className="flex-1 flex flex-col relative w-full h-full">
            {children}
          </main>
          <Dock />
        </div>
      </body>
    </html>
  );
}
