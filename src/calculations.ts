export function formatCurrencyFromCents(
  value: number | null | undefined,
  currency = "USD"
) {
  if (value == null) return "-";

  const locale = currency === "CLP" ? "es-CL" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value / 100);
}