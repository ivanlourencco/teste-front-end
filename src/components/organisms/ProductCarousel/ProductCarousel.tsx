"use client"

import { AnimatePresence, motion } from "framer-motion"
import { IconButton } from "@/components/atoms"
import { ProductCard } from "@/components/molecules"
import { useCarousel } from "@/hooks/useCarousel"
import type { Product } from "@/lib/catalog"
import styles from "./ProductCarousel.module.scss"

type ProductCarouselProps = {
  products: readonly Product[]
  onSelect: (product: Product) => void
  /** Muda a cada troca de aba: reinicia o scroll e reanima os cards. */
  listKey: string
  label: string
  priority?: boolean
}

export function ProductCarousel({ products, onSelect, listKey, label, priority = false }: ProductCarouselProps) {
  // A lista é remontada a cada aba (key), então o scroll já volta ao início.
  const { trackRef, canPrev, canNext, prev, next } = useCarousel<HTMLUListElement>()

  if (products.length === 0) {
    return (
      <p className={styles.empty} role="status">
        Nenhum produto encontrado nesta categoria.
      </p>
    )
  }

  return (
    <div className={styles.carousel}>
      <IconButton
        icon="chevron"
        flip
        variant="floating"
        label="Produtos anteriores"
        iconSize={{ width: 8, height: 13 }}
        className={styles.prev}
        onClick={prev}
        disabled={!canPrev}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={listKey}
          ref={trackRef}
          className={styles.track}
          aria-label={label}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {products.map((product, index) => (
            <li key={product.id} className={styles.slide}>
              <ProductCard product={product} onSelect={onSelect} priority={priority && index < 4} />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <IconButton
        icon="chevron"
        variant="floating"
        label="Próximos produtos"
        iconSize={{ width: 8, height: 13 }}
        className={styles.next}
        onClick={next}
        disabled={!canNext}
      />
    </div>
  )
}
