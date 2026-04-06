"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  generatePasswordResetToken,
  getAppBaseUrl,
  getPasswordResetExpiry,
  hashPasswordResetToken,
} from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/forgot-password?sent=1");
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    await db.passwordResetToken.deleteMany({
      where: {
        email,
        usedAt: null,
      },
    });

    const token = generatePasswordResetToken();
    const tokenHash = hashPasswordResetToken(token);
    const expiresAt = getPasswordResetExpiry();
    const resetUrl = `${getAppBaseUrl()}/reset-password/${token}`;

    await db.passwordResetToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      },
    });

    await sendPasswordResetEmail({
      to: email,
      resetUrl,
    });
  }

  redirect("/forgot-password?sent=1");
}
