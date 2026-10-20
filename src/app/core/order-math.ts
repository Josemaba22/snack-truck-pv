const toCents = (amount: number): number => Math.round(amount * 100);

// Mismo cálculo que la API: (precio + extras) * cantidad, a 2 decimales. Los precios tienen
// como máximo 2 decimales, así que operar en centavos evita errores de punto flotante.
export function lineSubtotal(unitPrice: number, extraPrices: number[], quantity: number): number {
  const extrasCents = extraPrices.reduce((sum, price) => sum + toCents(price), 0);
  return ((toCents(unitPrice) + extrasCents) * quantity) / 100;
}

export function sumAmounts(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + toCents(amount), 0) / 100;
}
