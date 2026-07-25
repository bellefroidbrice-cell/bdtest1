const priceFormatter = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const mileageFormatter = new Intl.NumberFormat("fr-BE");

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatMileage(value: number) {
  return `${mileageFormatter.format(value)} km`;
}
