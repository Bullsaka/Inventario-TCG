import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">TCG Inventory Manager</h1>
      <p className="mt-2 text-gray-600">
        MVP inicial para gestionar cartas, stock y precios.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/inventory"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Ver inventario
        </Link>

        <Link
          href="/inventory/new"
          className="rounded-md border px-4 py-2"
        >
          Nueva carta
        </Link>
      </div>
    </main>
  );
}
