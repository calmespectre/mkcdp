import { createContext, useContext, useState } from "react";

const GiftCartContext = createContext(null);

export function GiftCartProvider({ children }) {
  const [cart, setCart] = useState({});
  return (
    <GiftCartContext.Provider value={{ cart, setCart }}>
      {children}
    </GiftCartContext.Provider>
  );
}

export function useGiftCart() {
  const ctx = useContext(GiftCartContext);
  if (!ctx) throw new Error("useGiftCart must be used inside a GiftCartProvider");
  return ctx;
}

export function countCartItems(cart) {
  return Object.values(cart || {}).reduce((s, qty) => s + (qty > 0 ? qty : 0), 0);
}