"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Icon } from "@/components/atoms"
import { useCart } from "@/providers/CartProvider"
import styles from "./Header.module.scss"

export function CartLink({ className }: { className?: string }) {
  const { count } = useCart()
  const label = count > 0 ? `Carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho vazio"

  return (
    <a href="#" className={className} aria-label={label}>
      <Icon name="cart" size={32} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            className={styles.badge}
            aria-hidden="true"
            data-testid="cart-count"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}
