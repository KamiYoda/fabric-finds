export function formatNaira(amount: number): string {
  return "₦" + new Intl.NumberFormat("en-NG").format(amount);
}
