import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Aviora Jewelry";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Header siteName={SITE_NAME} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
