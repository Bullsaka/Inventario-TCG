import Link from "next/link";
import { registerUser } from "./actions";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Registra un usuario para usar tu inventario.
        </p>
      </div>

      <form
        action={registerUser}
        className="space-y-4 rounded-xl border border-zinc-800 p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            name="name"
            required
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-white underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
