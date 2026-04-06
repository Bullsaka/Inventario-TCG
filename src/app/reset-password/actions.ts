"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPasswordResetToken } from "@/lib/password-reset";

function redirectWithError(token: string, message: string) {
  redirect(`/reset-password/${encodeURIComponent(token)}?error=${encodeURIComponent(message)}`);
}

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    redirect("/forgot-password");
  }

  if (password.length < 6) {
    redirectWithError(token, "La contraseña debe tener al menos 6 caracteres.");
  }

  if (password !== confirmPassword) {
    redirectWithError(token, "Las contraseñas no coinciden.");
  }

  const tokenHash = hashPasswordResetToken(token);

  const resetToken = await db.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) {
    redirect("/forgot-password?sent=1");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    db.passwordResetToken.deleteMany({
      where: {
        email: resetToken.email,
        usedAt: null,
        id: {
          not: resetToken.id,
        },
      },
    }),
  ]);

  redirect("/login?reset=1");
}
