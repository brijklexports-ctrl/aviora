import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avioralab.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Certified diamond jewelry for retailers`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "IGI certified diamond jewelry made in Dubai, supplied to retailers. 30 years in business, 1,000+ retailers served.",
  openGraph: {
    title: SITE_NAME,
    description: "IGI certified diamond jewelry made in Dubai, supplied to retailers.",
    type: "website",
    siteName: SITE_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// No header here: the (shop) route group has its own layout with the site
// header and footer. Admin pages have their own layout too.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
