"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/calculations";
import { deleteCardItem } from "@/app/inventory/actions";

type InventoryItem = {
  id: string;
  imageUrl: string | null;
  game: string;
  name: string;
  setName: string | null;
  cardNumber: string | null;
  rarity: string | null;
  language: string;
  condition: string;
  quantity: number;
  purchasePriceCents: number;
  targetSalePriceCents: number | null;
  stockStatus: string;
};

type InventoryTableProps = {
  items: InventoryItem[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDateForFilename(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}_${hh}-${mi}`;
}

function formatDateForSheet(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
}

export default function InventoryTable({ items }: InventoryTableProps) {
  const [selectedGame, setSelectedGame] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const gameOptions = useMemo(() => {
    return ["ALL", ...Array.from(new Set(items.map((item) => item.game))).sort()];
  }, [items]);

  const filteredByGame = useMemo(() => {
    if (selectedGame === "ALL") {
      return items;
    }

    return items.filter((item) => item.game === selectedGame);
  }, [items, selectedGame]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return filteredByGame;
    }

    return filteredByGame.filter((item) =>
      normalizeText(item.name).includes(normalizedSearch)
    );
  }, [filteredByGame, search]);

  const suggestions = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return [];
    }

    const uniqueNames = Array.from(
      new Set(
        filteredByGame
          .map((item) => item.name)
          .filter((name) => normalizeText(name).includes(normalizedSearch))
      )
    );

    return uniqueNames.slice(0, 6);
  }, [filteredByGame, search]);

  const summary = useMemo(() => {
    const totalUnits = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalInvestedClp = filteredItems.reduce(
      (sum, item) => sum + item.purchasePriceCents,
      0
    );
    const totalTargetClp = filteredItems.reduce(
      (sum, item) => sum + (item.targetSalePriceCents ?? 0),
      0
    );

    const byGame = Array.from(
      filteredItems.reduce((map, item) => {
        map.set(item.game, (map.get(item.game) ?? 0) + item.quantity);
        return map;
      }, new Map<string, number>())
    ).sort(([a], [b]) => a.localeCompare(b));

    return {
      visibleRows: filteredItems.length,
      totalUnits,
      totalInvestedClp,
      totalTargetClp,
      byGame,
    };
  }, [filteredItems]);

  function handleSuggestionClick(value: string) {
    setSearch(value);
    setShowSuggestions(false);
  }

  function handleClearFilters() {
    setSelectedGame("ALL");
    setSearch("");
    setShowSuggestions(false);
  }

  async function handleExportExcel() {
    if (filteredItems.length === 0 || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const XLSX = await import("xlsx");
      const now = new Date();
      const filtersText = [
        `Juego: ${selectedGame === "ALL" ? "Todos" : selectedGame}`,
        `Búsqueda: ${search.trim() || "Sin filtro"}`,
      ].join(" | ");

      const inventoryHeaders = [
        "Juego",
        "Nombre",
        "Set",
        "Número",
        "Rareza",
        "Idioma",
        "Condición",
        "Cantidad",
        "Costo (CLP)",
        "Objetivo (CLP)",
        "Estado",
        "Imagen",
      ];

      const inventoryRows = filteredItems.map((item) => [
        item.game,
        item.name,
        item.setName ?? "",
        item.cardNumber ?? "",
        item.rarity ?? "",
        item.language,
        item.condition,
        item.quantity,
        item.purchasePriceCents / 100,
        item.targetSalePriceCents ? item.targetSalePriceCents / 100 : 0,
        item.stockStatus,
        item.imageUrl ? "Ver imagen" : "",
      ]);

      const inventorySheet = XLSX.utils.aoa_to_sheet([
        ["Inventario TCG"],
        [`Generado: ${formatDateForSheet(now)}`],
        [`Filtros: ${filtersText}`],
        [],
        inventoryHeaders,
        ...inventoryRows,
      ]);

      inventorySheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
      inventorySheet["!cols"] = [
        { wch: 14 },
        { wch: 28 },
        { wch: 22 },
        { wch: 14 },
        { wch: 18 },
        { wch: 10 },
        { wch: 16 },
        { wch: 10 },
        { wch: 14 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
      ];
      inventorySheet["!rows"] = [{ hpt: 24 }, { hpt: 18 }, { hpt: 18 }];
      inventorySheet["!autofilter"] = {
        ref: `A5:L${Math.max(5, inventoryRows.length + 5)}`,
      };

      for (let i = 0; i < filteredItems.length; i += 1) {
        const excelRow = i + 6;
        const costCell = inventorySheet[`I${excelRow}`];
        const targetCell = inventorySheet[`J${excelRow}`];
        const imageCell = inventorySheet[`L${excelRow}`];

        if (costCell) costCell.z = '#,##0';
        if (targetCell) targetCell.z = '#,##0';

        if (imageCell && filteredItems[i]?.imageUrl) {
          imageCell.l = {
            Target: filteredItems[i].imageUrl!,
            Tooltip: `Abrir imagen de ${filteredItems[i].name}`,
          };
        }
      }

      const summaryRows = [
        ["Resumen de exportación"],
        [`Generado: ${formatDateForSheet(now)}`],
        [`Filtros: ${filtersText}`],
        [],
        ["Métrica", "Valor"],
        ["Registros visibles", summary.visibleRows],
        ["Unidades totales", summary.totalUnits],
        ["Costo total (CLP)", summary.totalInvestedClp / 100],
        ["Objetivo total (CLP)", summary.totalTargetClp / 100],
        [],
        ["Juego", "Unidades"],
        ...summary.byGame.map(([game, qty]) => [game, qty]),
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
      summarySheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
      summarySheet["!cols"] = [{ wch: 24 }, { wch: 18 }];
      summarySheet["B8"].z = '#,##0';
      summarySheet["B9"].z = '#,##0';

      const workbook = XLSX.utils.book_new();
      workbook.Props = {
        Title: "Inventario TCG",
        Subject: "Exportación de inventario filtrado",
        Author: "TCG Inventory Manager",
        CreatedDate: now,
      };

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
      XLSX.utils.book_append_sheet(workbook, inventorySheet, "Inventario");

      const filename = `inventario_tcg_${formatDateForFilename(now)}.xlsx`;
      XLSX.writeFileXLSX(workbook, filename, { compression: true });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 lg:grid-cols-[220px_minmax(0,1fr)_auto_auto]">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            Juego
          </label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-zinc-500"
          >
            {gameOptions.map((game) => (
              <option key={game} value={game}>
                {game === "ALL" ? "Todos" : game}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            Buscar por nombre
          </label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => {
                setShowSuggestions(false);
              }, 120);
            }}
            placeholder="Escribe parte del nombre..."
            className="w-full rounded-md border border-zinc-700 bg-black px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500"
          />

          {showSuggestions && suggestions.length > 0 ? (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full border-b border-zinc-800 px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800 last:border-b-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 lg:w-auto"
          >
            Limpiar
          </button>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={filteredItems.length === 0 || isExporting}
            className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            {isExporting ? "Exportando..." : "Exportar Excel"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <p>
          Mostrando <span className="font-medium text-zinc-200">{filteredItems.length}</span>{" "}
          resultado{filteredItems.length === 1 ? "" : "s"}
        </p>

        {(selectedGame !== "ALL" || search.trim()) && (
          <p>
            Filtros activos:{" "}
            <span className="text-zinc-200">
              {selectedGame !== "ALL" ? selectedGame : "Todos"}
              {search.trim() ? ` · "${search.trim()}"` : ""}
            </span>
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 p-10 text-center">
          <p className="text-lg font-medium">No hay cartas cargadas.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Crea tu primera carta para empezar el inventario.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 p-10 text-center">
          <p className="text-lg font-medium">No se encontraron coincidencias.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Ajusta el juego o prueba con otro fragmento del nombre.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-black">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-zinc-800 text-left text-zinc-100">
              <tr>
                <th className="border-b border-zinc-700 px-4 py-3">Imagen</th>
                <th className="border-b border-zinc-700 px-4 py-3">Juego</th>
                <th className="border-b border-zinc-700 px-4 py-3">Nombre</th>
                <th className="border-b border-zinc-700 px-4 py-3">Set</th>
                <th className="border-b border-zinc-700 px-4 py-3">Número</th>
                <th className="border-b border-zinc-700 px-4 py-3">Rareza</th>
                <th className="border-b border-zinc-700 px-4 py-3">Idioma</th>
                <th className="border-b border-zinc-700 px-4 py-3">Condición</th>
                <th className="border-b border-zinc-700 px-4 py-3">Cantidad</th>
                <th className="border-b border-zinc-700 px-4 py-3">Costo</th>
                <th className="border-b border-zinc-700 px-4 py-3">Objetivo</th>
                <th className="border-b border-zinc-700 px-4 py-3">Estado</th>
                <th className="border-b border-zinc-700 px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/60">
                  <td className="border-b border-zinc-800 px-4 py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-12 rounded border border-zinc-700 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-12 items-center justify-center rounded border border-zinc-700 text-xs text-zinc-500">
                        Sin imagen
                      </div>
                    )}
                  </td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.game}</td>

                  <td className="border-b border-zinc-800 px-4 py-3 font-medium">
                    {item.name}
                  </td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.setName ?? "-"}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.cardNumber ?? "-"}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.rarity ?? "-"}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.language}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.condition}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.quantity}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">
                    {formatCurrencyFromCents(item.purchasePriceCents)}
                  </td>

                  <td className="border-b border-zinc-800 px-4 py-3">
                    {formatCurrencyFromCents(item.targetSalePriceCents)}
                  </td>

                  <td className="border-b border-zinc-800 px-4 py-3">{item.stockStatus}</td>

                  <td className="border-b border-zinc-800 px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/inventory/${item.id}/edit`}
                        className="rounded-md border border-zinc-500 px-3 py-1 text-xs text-white hover:bg-zinc-800"
                      >
                        Editar
                      </Link>

                      <form action={deleteCardItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-400 hover:bg-red-950/40"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
