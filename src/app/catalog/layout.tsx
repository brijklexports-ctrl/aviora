import { Header } from "@/components/Header";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header siteName={SITE_NAME} />
      <main>{children}</main>
    </div>
  );
}
