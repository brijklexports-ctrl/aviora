"use server";

import { revalidatePath } from "next/cache";
import { updateProductAdmin } from "@/lib/db";

export async function saveProductAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Missing id");

  const featured = formData.get("featured") === "on";
  const hidden = formData.get("hidden") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") || "").trim();
  const titleOverride = String(formData.get("titleOverride") || "").trim();
  const descriptionOverride = String(formData.get("descriptionOverride") || "").trim();

  await updateProductAdmin(id, {
    featured,
    hidden,
    sortOrder: sortOrderRaw === "" ? null : Number(sortOrderRaw),
    titleOverride: titleOverride || null,
    descriptionOverride: descriptionOverride || null,
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/product/[slug]", "page");
}
