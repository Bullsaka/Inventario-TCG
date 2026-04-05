"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Correo o contraseña inválidos.");
      return;
    }

    router.push("/inventory");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Accede a tu inventario personal.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-zinc-800 p-6"
      >
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
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {searchParams.get("error") ? (
          <p className="text-sm text-red-400">No fue posible iniciar sesión.</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-white underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
