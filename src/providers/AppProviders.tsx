"use client"

import { MotionConfig } from "framer-motion"
import type { ReactNode } from "react"
import { CartProvider } from "./CartProvider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>{children}</CartProvider>
    </MotionConfig>
  )
}
