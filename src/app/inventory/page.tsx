export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import InventoryTable from "@/components/inventory/inventory-table";
import LogoutButton from "@/components/auth/logout-button";

export default async function InventoryPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  const userId = user?.id;

  if (!userId) {
    redirect("/login");
  }

  const items = await db.cardItem.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-[1600px] p-4 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-zinc-400">
            Cartas registradas en tu colección
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory/new"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Agregar carta
          </Link>

          <LogoutButton />
        </div>
      </div>

      <InventoryTable items={items} />
    </main>
  );
}