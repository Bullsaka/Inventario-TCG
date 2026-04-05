export function calculateNetProfit(params: {
  salePriceCents: number;
  feeCents: number;
  shippingCostCents: number;
  baseCostCents: number;
}) {
  const { salePriceCents, feeCents, shippingCostCents, baseCostCents } = params;

  return salePriceCents - feeCents - shippingCostCents - baseCostCents;
}

export function formatCurrencyFromCents(value: number | null | undefined) {
  if (value == null) return "-";

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value / 100);
}
