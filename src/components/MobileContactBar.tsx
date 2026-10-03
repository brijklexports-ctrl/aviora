import { COMPANY, phoneLink, whatsappLink } from "@/lib/company";
import { Icon } from "./Icons";

// Sticky bottom bar on phones. Renders nothing until a phone or WhatsApp
// number is set in src/lib/company.ts, so visitors never see a dead button.
export function MobileContactBar() {
  const wa = whatsappLink(`Hi ${COMPANY.brand}, I'd like to know more about your jewelry.`);
  const tel = phoneLink();
  if (!wa && !tel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      {wa && (
        <a
          href={wa}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[#1f8f4e] text-sm font-medium text-white"
        >
          <Icon name="chat" /> WhatsApp
        </a>
      )}
      {tel && (
        <a
          href={tel}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white"
        >
          <Icon name="phone" /> Call us
        </a>
      )}
    </div>
  );
}
