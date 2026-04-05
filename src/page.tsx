import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrencyFromCents } from "@/lib/calculations";

export default async function InventoryPage() {
  const items = await db.cardItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-gray-600">
            Cartas registradas en tu colección
          </p>
        </div>

        <Link
          href="/inventory/new"
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Agregar carta
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-lg font-medium">No hay cartas cargadas.</p>
          <p className="mt-2 text-sm text-gray-600">
            Crea tu primera carta para empezar el inventario.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="border-b px-4 py-3">Imagen</th>
                <th className="border-b px-4 py-3">Juego</th>
                <th className="border-b px-4 py-3">Nombre</th>
                <th className="border-b px-4 py-3">Set</th>
                <th className="border-b px-4 py-3">Número</th>
                <th className="border-b px-4 py-3">Rareza</th>
                <th className="border-b px-4 py-3">Idioma</th>
                <th className="border-b px-4 py-3">Condición</th>
                <th className="border-b px-4 py-3">Cantidad</th>
                <th className="border-b px-4 py-3">Costo</th>
                <th className="border-b px-4 py-3">Objetivo</th>
                <th className="border-b px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-12 rounded border object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-12 items-center justify-center rounded border text-xs text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="border-b px-4 py-3">{item.game}</td>
                  <td className="border-b px-4 py-3 font-medium">{item.name}</td>
                  <td className="border-b px-4 py-3">{item.setName ?? "-"}</td>
                  <td className="border-b px-4 py-3">{item.cardNumber ?? "-"}</td>
                  <td className="border-b px-4 py-3">{item.rarity ?? "-"}</td>
                  <td className="border-b px-4 py-3">{item.language}</td>
                  <td className="border-b px-4 py-3">{item.condition}</td>
                  <td className="border-b px-4 py-3">{item.quantity}</td>
                  <td className="border-b px-4 py-3">
                    {formatCurrencyFromCents(item.purchasePriceCents)}
                  </td>
                  <td className="border-b px-4 py-3">
                    {formatCurrencyFromCents(item.targetSalePriceCents)}
                  </td>
                  <td className="border-b px-4 py-3">{item.stockStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}