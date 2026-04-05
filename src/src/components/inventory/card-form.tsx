"use client";

import { useEffect, useMemo, useState } from "react";

type CardFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialValues?: {
    id?: string;
    game?: string;
    name?: string;
    cardNumber?: string;
    setName?: string;
    rarity?: string;
    language?: string;
    condition?: string;
    productType?: string;
    quantity?: number;
    purchasePrice?: number;
    targetSalePrice?: number;
    minAcceptablePrice?: number;
    imageUrl?: string;
    notes?: string;
  };
};

const DEFAULT_CONDITIONS = ["NM", "LP", "MP", "HP", "DMG"];

const RIFTBOUND_RARITIES = [
  "Común",
  "Poco común",
  "Rara",
  "Épica",
  "Alternate Art",
  "Overnumbered",
  "Ultimate Rare",
];

const RIFTBOUND_CONDITIONS = [
  "Champion",
  "Spell",
  "Unit",
  "Gear",
  "Legend",
  "Rune",
  "Battlefield",
];

export default function CardForm({
  mode,
  action,
  submitLabel,
  initialValues,
}: CardFormProps) {
  const [game, setGame] = useState(initialValues?.game ?? "POKEMON");
  const [rarity, setRarity] = useState(initialValues?.rarity ?? "");
  const [condition, setCondition] = useState(initialValues?.condition ?? "NM");

  const isRiftbound = game === "RIFTBOUND";

  const conditionOptions = useMemo(() => {
    return isRiftbound ? RIFTBOUND_CONDITIONS : DEFAULT_CONDITIONS;
  }, [isRiftbound]);

  useEffect(() => {
    if (isRiftbound) {
      if (!RIFTBOUND_RARITIES.includes(rarity)) {
        setRarity(RIFTBOUND_RARITIES[0]);
      }

      if (!RIFTBOUND_CONDITIONS.includes(condition)) {
        setCondition(RIFTBOUND_CONDITIONS[0]);
      }
    } else {
      if (!DEFAULT_CONDITIONS.includes(condition)) {
        setCondition("NM");
      }
    }
  }, [isRiftbound, rarity, condition]);

  return (
    <form action={action} className="space-y-6 rounded-xl border border-zinc-800 p-6">
      {mode === "edit" && initialValues?.id ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Juego *</label>
          <select
            name="game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          >
            <option value="POKEMON">Pokemon</option>
            <option value="ONE_PIECE">One Piece</option>
            <option value="RIFTBOUND">Riftbound</option>
            <option value="YUGIOH">Yu-Gi-Oh!</option>
            <option value="MTG">Magic</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nombre *</label>
          <input
            name="name"
            required
            defaultValue={initialValues?.name ?? ""}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="Charizard ex"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Número</label>
          <input
            name="cardNumber"
            defaultValue={initialValues?.cardNumber ?? ""}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="199/165"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Set</label>
          <input
            name="setName"
            defaultValue={initialValues?.setName ?? ""}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="151"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Rareza</label>

          {isRiftbound ? (
            <select
              name="rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            >
              {RIFTBOUND_RARITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : (
            <input
              name="rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
              placeholder="SAR / Secret Rare / Epic"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Idioma</label>
          <select
            name="language"
            defaultValue={initialValues?.language ?? "EN"}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          >
            <option value="EN">EN</option>
            <option value="ES">ES</option>
            <option value="JP">JP</option>
            <option value="PT">PT</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Condición</label>

          <select
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          >
            {conditionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tipo</label>
          <select
            name="productType"
            defaultValue={initialValues?.productType ?? "SINGLE"}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          >
            <option value="SINGLE">Single</option>
            <option value="SEALED">Sealed</option>
            <option value="LOT">Lot</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Cantidad</label>
          <input
            name="quantity"
            type="number"
            min={1}
            required
            defaultValue={initialValues?.quantity ?? 1}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Costo compra (CLP)</label>
          <input
            name="purchasePrice"
            type="number"
            min={0}
            required
            defaultValue={initialValues?.purchasePrice ?? 0}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="2050"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Precio objetivo (CLP)</label>
          <input
            name="targetSalePrice"
            type="number"
            min={0}
            defaultValue={initialValues?.targetSalePrice ?? 0}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="3000"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Precio mínimo aceptable (CLP)
          </label>
          <input
            name="minAcceptablePrice"
            type="number"
            min={0}
            defaultValue={initialValues?.minAcceptablePrice ?? 0}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
            placeholder="2500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Imagen URL</label>
        <input
          name="imageUrl"
          defaultValue={initialValues?.imageUrl ?? ""}
          className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notas</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={initialValues?.notes ?? ""}
          className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white"
          placeholder="Observaciones"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200"
      >
        {submitLabel}
      </button>
    </form>
  );
}
