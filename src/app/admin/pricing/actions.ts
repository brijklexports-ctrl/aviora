"use server";

import { revalidatePath } from "next/cache";
import { setCategoryRates, setShowPrices } from "@/lib/db";

function parseRate(raw: FormDataEntryValue | null): number | null {
  const text = String(raw ?? "").trim();
  if (text === "") return null;
  const n = Number(text);
  if (!Number.isFinite(n) || n < 0) throw new Error("Rates must be a number that is zero or more");
  return n;
}

function refresh() {
  revalidatePath("/admin/pricing");
  revalidatePath("/shop");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/product/[slug]", "page");
}

export async function saveRatesAction(formData: FormData) {
  const category = String(formData.get("category") || "");
  if (!category) throw new Error("Missing category");
  await setCategoryRates(category, parseRate(formData.get("perGram")), parseRate(formData.get("perCarat")));
  refresh();
}

export async function saveShowPricesAction(formData: FormData) {
  await setShowPrices(formData.get("showPrices") === "on");
  refresh();
}
