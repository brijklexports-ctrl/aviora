"use server";

import { revalidatePath } from "next/cache";
import { upsertCollectionMeta } from "@/lib/db";

export async function saveCollectionAction(formData: FormData) {
  const productType = String(formData.get("productType") || "");
  if (!productType) throw new Error("Missing productType");

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const heroImageUrl = String(formData.get("heroImageUrl") || "").trim();
  const published = formData.get("published") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") || "").trim();

  await upsertCollectionMeta(productType, {
    title: title || null,
    description: description || null,
    heroImageUrl: heroImageUrl || null,
    published,
    sortOrder: sortOrderRaw === "" ? null : Number(sortOrderRaw),
  });

  revalidatePath("/admin/collections");
  revalidatePath("/");
  revalidatePath("/collections/[slug]", "page");
}
