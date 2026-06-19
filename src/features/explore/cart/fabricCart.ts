// Tiny module-level fabric cart store with React hook.
// Scoped per merchant; switching merchant resets the cart.
import { useSyncExternalStore } from "react";

export interface FabricCartItem {
  productId: string;
  productName: string;
  productImage: string;
  colorId: string;
  colorName: string;
  unit: "Yards" | "Pieces";
  quantity: number;
  pricePerUnit: number;
}

interface State {
  merchantId: string | null;
  items: FabricCartItem[];
}

let state: State = { merchantId: null, items: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function set(updater: (s: State) => State) {
  state = updater(state);
  emit();
}

export function setActiveMerchant(merchantId: string) {
  if (state.merchantId !== merchantId) {
    state = { merchantId, items: [] };
    emit();
  }
}

export function addItem(item: FabricCartItem) {
  set((s) => {
    const existing = s.items.find(
      (i) => i.productId === item.productId && i.colorId === item.colorId,
    );
    if (existing) {
      return {
        ...s,
        items: s.items.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
        ),
      };
    }
    return { ...s, items: [...s.items, item] };
  });
}

export function removeItem(productId: string) {
  set((s) => ({ ...s, items: s.items.filter((i) => i.productId !== productId) }));
}

export function updateQuantity(productId: string, quantity: number) {
  set((s) => ({
    ...s,
    items: s.items
      .map((i) => (i.productId === productId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0),
  }));
}

export function clearCart() {
  set((s) => ({ ...s, items: [] }));
}

export function useFabricCart() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

export function cartTotal(items: FabricCartItem[]) {
  return items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);
}

export function cartItemCount(items: FabricCartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
