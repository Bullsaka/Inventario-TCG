import Link from "next/link";
import { createCardItem } from "../actions";
import CardForm from "@/components/inventory/card-form";

export default function NewInventoryItemPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nueva carta</h1>

        <Link
          href="/inventory"
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
        >
          Volver
        </Link>
      </div>

      <CardForm
        mode="create"
        action={createCardItem}
        submitLabel="Guardar carta"
        initialValues={{
          game: "POKEMON",
          language: "EN",
          condition: "NM",
          productType: "SINGLE",
          quantity: 1,
          purchasePrice: 0,
          targetSalePrice: 0,
          minAcceptablePrice: 0,
        }}
      />
    </main>
  );
}
