"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Ese correo ya existe.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  redirect("/login");
}
