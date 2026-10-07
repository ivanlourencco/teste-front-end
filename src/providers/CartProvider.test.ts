import type { Product } from "@/lib/catalog"
import { cartReducer } from "./CartProvider"

const product: Product = {
  id: "iphone-0",
  name: "Iphone",
  description: "Iphone",
  photo: "https://x/a.png",
  price: 100,
  category: "celular",
}

describe("cartReducer", () => {
  const empty = { lines: [], lastMessage: "" }

  it("adiciona um produto novo", () => {
    const state = cartReducer(empty, { type: "add", product, quantity: 2 })
    expect(state.lines).toEqual([{ product, quantity: 2 }])
    expect(state.lastMessage).toBe("2 unidades adicionadas ao carrinho: Iphone.")
  })

  it("soma a quantidade quando o produto já está no carrinho", () => {
    const once = cartReducer(empty, { type: "add", product, quantity: 1 })
    const twice = cartReducer(once, { type: "add", product, quantity: 3 })
    expect(twice.lines).toEqual([{ product, quantity: 4 }])
  })

  it("nunca adiciona menos de uma unidade", () => {
    const state = cartReducer(empty, { type: "add", product, quantity: 0 })
    expect(state.lines[0]?.quantity).toBe(1)
    expect(state.lastMessage).toBe("1 unidade adicionada ao carrinho: Iphone.")
  })
})
