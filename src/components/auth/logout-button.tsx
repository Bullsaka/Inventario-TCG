"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/login" })}
      className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900"
    >
      Cerrar sesión
    </button>
  );
}
