"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, checkPassword, sessionToken } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  if (!checkPassword(password)) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const token = await sessionToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
