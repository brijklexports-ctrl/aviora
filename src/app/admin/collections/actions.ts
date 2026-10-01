"use server";

import { revalidatePath } from "next/cache";
import { upsertCollectionMeta, setCategoryAlias } from "@/lib/db";

function revalidateCollections() {
  revalidatePath("/admin/collections");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/collections/[slug]", "page");
}

export async function setCategoryAliasAction(formData: FormData) {
  const source = String(formData.get("source") || "");
  if (!source) throw new Error("Missing source");
  const target = String(formData.get("target") || "").trim();

  await setCategoryAlias(source, target || null);
  revalidateCollections();
}

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

  revalidateCollections();
}
