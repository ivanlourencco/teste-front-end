"use client"

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react"
import type { Product } from "@/lib/catalog"

export type CartLine = { product: Product; quantity: number }

type CartState = { lines: CartLine[]; lastMessage: string }

type CartAction = { type: "add"; product: Product; quantity: number }

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const quantity = Math.max(1, Math.trunc(action.quantity))
      const exists = state.lines.some((line) => line.product.id === action.product.id)
      const lines = exists
        ? state.lines.map((line) =>
            line.product.id === action.product.id ? { ...line, quantity: line.quantity + quantity } : line,
          )
        : [...state.lines, { product: action.product, quantity }]
      const summary = quantity === 1 ? "1 unidade adicionada" : `${quantity} unidades adicionadas`
      return { lines, lastMessage: `${summary} ao carrinho: ${action.product.name}.` }
    }
  }
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  addItem: (product: Product, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [], lastMessage: "" })

  const addItem = useCallback((product: Product, quantity: number) => {
    dispatch({ type: "add", product, quantity })
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count: state.lines.reduce((total, line) => total + line.quantity, 0),
      addItem,
    }),
    [state.lines, addItem],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Anuncia a adição para leitores de tela sem roubar o foco. */}
      <p className="sr-only" role="status" aria-live="polite">
        {state.lastMessage}
      </p>
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart deve ser usado dentro de <CartProvider>")
  return context
}
