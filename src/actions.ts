"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

function toCents(value: FormDataEntryValue | null) {
  const raw = String(value ?? "0").replace(",", ".").trim();
  const num = Number(raw);

  if (Number.isNaN(num) || num < 0) {
    return 0;
  }

  return Math.round(num * 100);
}

export async function createCardItem(formData: FormData) {
  const game = String(formData.get("game") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const setName = String(formData.get("setName") ?? "").trim();
  const rarity = String(formData.get("rarity") ?? "").trim();
  const language = String(formData.get("language") ?? "EN").trim();
  const condition = String(formData.get("condition") ?? "NM").trim();
  const productType = String(formData.get("productType") ?? "SINGLE").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const purchasePriceCents = toCents(formData.get("purchasePrice"));
  const targetSalePriceCents = toCents(formData.get("targetSalePrice"));
  const minAcceptablePriceCents = toCents(formData.get("minAcceptablePrice"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!game || !name) {
    throw new Error("Game y Name son obligatorios.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity debe ser un entero mayor o igual a 1.");
  }

  const demoEmail = "demo@local.dev";

  const user = await db.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: "Demo User",
      passwordHash: "demo-not-used",
    },
  });

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