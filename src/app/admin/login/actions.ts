"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

type LoginResult = { success: false; error: string } | undefined;

export async function login(
  _prevState: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  const password = String(formData.get("password") ?? "");
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    return { success: false, error: "Authentification non configurée." };
  }

  const isValid = await bcrypt.compare(password, passwordHash);
  if (!isValid) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
