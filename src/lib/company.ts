// Single place for company facts shown across the site. Anything left null
// is simply not displayed (no placeholder text ever reaches visitors).
export const COMPANY = {
  brand: "Aviora Jewelry",
  parent: "KL Exports",
  yearsInBusiness: "30",
  retailersServed: "1,000+",
  email: "brij.klexports@gmail.com",
  // Digits with country code, e.g. "+1 555 123 4567" — add when available.
  phone: null as string | null,
  // Digits only with country code, e.g. "15551234567" — add when available.
  whatsapp: null as string | null,
  address: null as string | null,
  googleUrl: "https://share.google/daeEPd5a4RiPTl9Fx",
};

export function whatsappLink(message?: string): string | null {
  if (!COMPANY.whatsapp) return null;
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${COMPANY.whatsapp}${q}`;
}

export function phoneLink(): string | null {
  if (!COMPANY.phone) return null;
  return `tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`;
}
