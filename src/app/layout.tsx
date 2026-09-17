import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_NAME} — fine jewelry catalog`,
};

// No header here: the (shop) route group (catalog + product pages, which
// is now the homepage) has its own layout that adds the catalog-browsing
// header. /wholesale renders its own full-width header/nav inline, so it
// stays outside that group and gets only this bare root layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
