import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="text-3xl font-bold">TCG Inventory Manager</h1>
      <p className="mt-2 text-zinc-400">
        Gestiona tu inventario de cartas.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-white px-4 py-2 text-black"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-zinc-700 px-4 py-2"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}