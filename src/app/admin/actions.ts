"use server";

import { revalidatePath } from "next/cache";
import { syncCatalog } from "@/lib/sync";

export async function triggerSyncAction() {
  await syncCatalog();
  revalidatePath("/admin");
  revalidatePath("/");
}
