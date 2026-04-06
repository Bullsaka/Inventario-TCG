import Link from "next/link";
import { requestPasswordReset } from "./actions";

type PageProps = {
  searchParams: Promise<{
    sent?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sent = params.sent === "1";

  return (
    <main className="mx-auto max-w-md p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {sent ? (
        <div className="mb-4 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-200">
          Si el correo existe, te enviamos un enlace para restablecer tu contraseña.
          Revisa tu bandeja de entrada y spam.
        </div>
      ) : null}

      <form
        action={requestPasswordReset}
        className="space-y-4 rounded-xl border border-zinc-800 p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
        >
          Enviar enlace
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-400">
        <Link href="/login" className="text-white underline">
          Volver al login
        </Link>
      </p>
    </main>
  );
}
