import Link from "next/link";
import { db } from "@/lib/db";
import InventoryTable from "@/components/inventory/inventory-table";

export default async function InventoryPage() {
  const items = await db.cardItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedItems = items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    game: item.game,
    name: item.name,
    setName: item.setName,
    cardNumber: item.cardNumber,
    rarity: item.rarity,
    language: item.language,
    condition: item.condition,
    quantity: item.quantity,
    purchasePriceCents: item.purchasePriceCents,
    targetSalePriceCents: item.targetSalePriceCents,
    stockStatus: item.stockStatus,
  }));

  return (
    <main className="mx-auto max-w-7xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-zinc-400">
            Cartas registradas en tu colección
          </p>
        </div>

        <Link
          href="/inventory/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Agregar carta
        </Link>
      </div>

      <InventoryTable items={serializedItems} />
    </main>
  );
}
