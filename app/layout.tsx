import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Website",
  description: "Personal website and blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-white dark:bg-black">
          <header className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-3xl mx-auto px-8 py-4">
              <Navigation />
            </div>
          </header>
          <div className="max-w-3xl mx-auto px-8 py-12">
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
