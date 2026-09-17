import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Wholesale Diamond Jewelry for Retailers`,
  description: `${SITE_NAME} supplies certified diamond jewelry at wholesale prices to independent and chain jewelry retailers across the USA. Apply for a wholesale account.`,
};

// No shared header here: the homepage (src/app/page.tsx) is the wholesale
// landing page with its own full-width header/nav. The catalog subtree
// (src/app/catalog) has its own layout that adds the catalog-browsing header.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
