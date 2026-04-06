import Link from "next/link";
import { db } from "@/lib/db";
import { hashPasswordResetToken } from "@/lib/password-reset";
import { resetPassword } from "../actions";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: PageProps) {
  const { token } = await params;
  const { error } = await searchParams;

  const tokenHash = hashPasswordResetToken(token);

  const resetToken = await db.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) {
    return (
      <main className="mx-auto max-w-md p-6 text-white">
        <div className="rounded-xl border border-zinc-800 p-6">
          <h1 className="text-2xl font-bold">Enlace no válido</h1>
          <p className="mt-3 text-sm text-zinc-400">
            El enlace expiró o ya fue utilizado. Solicita uno nuevo para restablecer tu contraseña.
          </p>
          <div className="mt-6">
            <Link
              href="/forgot-password"
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ingresa tu nueva contraseña para completar la recuperación.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <form
        action={resetPassword}
        className="space-y-4 rounded-xl border border-zinc-800 p-6"
      >
        <input type="hidden" name="token" value={token} />

        <div>
          <label className="mb-1 block text-sm font-medium">Nueva contraseña</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
        >
          Guardar nueva contraseña
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
