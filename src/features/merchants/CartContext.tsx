import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import type { CartItem, Fabric, Merchant } from "./types";

interface CartCtx {
  merchant?: Merchant;
  items: CartItem[];
  setMerchant: (m: Merchant) => void;
  addItem: (fabric: Fabric, variantId: string, quantity: number) => void;
  updateItem: (fabricId: string, patch: Partial<CartItem>) => void;
  removeItem: (fabricId: string) => void;
  clear: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartCtx | null>(null);

export function MerchantCartProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchantState] = useState<Merchant | undefined>();
  const [items, setItems] = useState<CartItem[]>([]);

  const setMerchant = useCallback(
    (m: Merchant) => {
      if (merchant && merchant.id !== m.id) setItems([]);
      setMerchantState(m);
    },
    [merchant],
  );

  const addItem = useCallback(
    (fabric: Fabric, variantId: string, quantity: number) => {
      const variant = fabric.variants.find((v) => v.id === variantId);
      setItems((prev) => {
        const existing = prev.find((i) => i.fabricId === fabric.id);
        if (existing) {
          return prev.map((i) =>
            i.fabricId === fabric.id
              ? { ...i, quantity, variantId, pricePerYard: fabric.pricePerYard }
              : i,
          );
        }
        return [
          ...prev,
          {
            fabricId: fabric.id,
            merchantId: fabric.merchantId,
            variantId,
            quantity,
            pricePerYard: fabric.pricePerYard,
            unit: fabric.unit,
            name: fabric.name,
            image: variant?.image ?? fabric.images[0],
          },
        ];
      });
    },
    [],
  );

  const updateItem = useCallback(
    (fabricId: string, patch: Partial<CartItem>) => {
      setItems((prev) =>
        prev.map((i) => (i.fabricId === fabricId ? { ...i, ...patch } : i)),
      );
    },
    [],
  );

  const removeItem = useCallback((fabricId: string) => {
    setItems((prev) => prev.filter((i) => i.fabricId !== fabricId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setMerchantState(undefined);
  }, []);

  const totalAmount = items.reduce(
    (sum, i) => sum + i.pricePerYard * i.quantity,
    0,
  );
  const totalItems = items.length;

  return (
    <CartContext.Provider
      value={{
        merchant,
        items,
        setMerchant,
        addItem,
        updateItem,
        removeItem,
        clear,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useMerchantCart() {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useMerchantCart must be used within MerchantCartProvider");
  return ctx;
}
