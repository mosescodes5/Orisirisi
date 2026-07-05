export const DELIVERY_FEE = 2500;
export const FREE_DELIVERY_THRESHOLD = 50000;

export function computeDeliveryFee(subtotal: number, itemCount: number) {
  if (itemCount === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
