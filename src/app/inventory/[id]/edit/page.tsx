import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateCardItem } from "../../actions";
import CardForm from "@/components/inventory/card-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditInventoryItemPage({ params }: PageProps) {
  const { id } = await params;

  const item = await db.cardItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar carta</h1>

        <Link
          href="/inventory"
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
        >
          Volver
        </Link>
      </div>

      <CardForm
        mode="edit"
        action={updateCardItem}
        submitLabel="Guardar cambios"
        initialValues={{
          id: item.id,
          game: item.game,
          name: item.name,
          cardNumber: item.cardNumber ?? "",
          setName: item.setName ?? "",
          rarity: item.rarity ?? "",
          language: item.language,
          condition: item.condition,
          productType: item.productType,
          quantity: item.quantity,
          purchasePrice: item.purchasePriceCents / 100,
          targetSalePrice: item.targetSalePriceCents
            ? item.targetSalePriceCents / 100
            : 0,
          minAcceptablePrice: item.minAcceptablePriceCents
            ? item.minAcceptablePriceCents / 100
            : 0,
          imageUrl: item.imageUrl ?? "",
          notes: item.notes ?? "",
        }}
      />
    </main>
  );
}
