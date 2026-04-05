"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";

function toCents(value: FormDataEntryValue | null) {
  const raw = String(value ?? "0").replace(",", ".").trim();
  const num = Number(raw);

  if (Number.isNaN(num) || num < 0) {
    return 0;
  }

  return Math.round(num * 100);
}

function toQuantity(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return 1;
  }

  const num = Number(raw);

  if (!Number.isInteger(num) || num < 1) {
    throw new Error("Quantity debe ser un entero mayor o igual a 1.");
  }

  return num;
}

async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function createCardItem(formData: FormData) {
  const user = await getCurrentUser();

  const game = String(formData.get("game") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const setName = String(formData.get("setName") ?? "").trim();
  const rarity = String(formData.get("rarity") ?? "").trim();
  const language = String(formData.get("language") ?? "EN").trim();
  const condition = String(formData.get("condition") ?? "NM").trim();
  const productType = String(formData.get("productType") ?? "SINGLE").trim();
  const quantity = toQuantity(formData.get("quantity"));
  const purchasePriceCents = toCents(formData.get("purchasePrice"));
  const targetSalePriceCents = toCents(formData.get("targetSalePrice"));
  const minAcceptablePriceCents = toCents(formData.get("minAcceptablePrice"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!game || !name) {
    throw new Error("Game y Name son obligatorios.");
  }

  await db.cardItem.create({
    data: {
      userId: user.id,
      game,
      name,
      cardNumber: cardNumber || null,
      setName: setName || null,
      rarity: rarity || null,
      language,
      condition,
      productType,
      quantity,
      purchasePriceCents,
      targetSalePriceCents: targetSalePriceCents || null,
      minAcceptablePriceCents: minAcceptablePriceCents || null,
      imageUrl: imageUrl || null,
      notes: notes || null,
      stockStatus: "IN_STOCK",
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function updateCardItem(formData: FormData) {
  const user = await getCurrentUser();

  const id = String(formData.get("id") ?? "").trim();
  const game = String(formData.get("game") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const setName = String(formData.get("setName") ?? "").trim();
  const rarity = String(formData.get("rarity") ?? "").trim();
  const language = String(formData.get("language") ?? "EN").trim();
  const condition = String(formData.get("condition") ?? "NM").trim();
  const productType = String(formData.get("productType") ?? "SINGLE").trim();
  const quantity = toQuantity(formData.get("quantity"));
  const purchasePriceCents = toCents(formData.get("purchasePrice"));
  const targetSalePriceCents = toCents(formData.get("targetSalePrice"));
  const minAcceptablePriceCents = toCents(formData.get("minAcceptablePrice"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!id) {
    throw new Error("ID inválido.");
  }

  if (!game || !name) {
    throw new Error("Game y Name son obligatorios.");
  }

  const existing = await db.cardItem.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existing) {
    redirect("/inventory");
  }

  await db.cardItem.update({
    where: { id: existing.id },
    data: {
      game,
      name,
      cardNumber: cardNumber || null,
      setName: setName || null,
      rarity: rarity || null,
      language,
      condition,
      productType,
      quantity,
      purchasePriceCents,
      targetSalePriceCents: targetSalePriceCents || null,
      minAcceptablePriceCents: minAcceptablePriceCents || null,
      imageUrl: imageUrl || null,
      notes: notes || null,
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function deleteCardItem(formData: FormData) {
  const user = await getCurrentUser();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/inventory");
  }

  const existing = await db.cardItem.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existing) {
    redirect("/inventory");
  }

  await db.cardItem.delete({
    where: { id: existing.id },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}