import crypto from "crypto";

export function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashPasswordResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getPasswordResetExpiry() {
  return new Date(Date.now() + 1000 * 60 * 60);
}

export function getAppBaseUrl() {
  const appUrl = process.env.APP_URL?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();

  const rawBaseUrl =
    appUrl ||
    nextAuthUrl ||
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

  return rawBaseUrl.replace(/\/$/, "");
}
