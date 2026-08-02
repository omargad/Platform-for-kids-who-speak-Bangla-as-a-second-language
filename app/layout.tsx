import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Viewport } from "next";
import "./globals.css";
import PwaBridge from "./components/PwaBridge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bangla Adventures | 108 guided Bangla learning sessions",
  description:
    "A bilingual learning journey with 18 modules and 108 guided listening, reading, speaking, writing, culture and mastery sessions.",
  manifest: "/manifest.webmanifest",
  applicationName: "Bangla Adventures",
  appleWebApp: { capable: true, title: "Bangla Adventures", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#075b4c",
  colorScheme: "light",
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
        {children}
        <PwaBridge />
      </body>
    </html>
  );
}
