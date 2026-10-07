"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { Button, IconButton } from "@/components/atoms"
import { QuantitySelector } from "@/components/molecules"
import { useScrollLock } from "@/hooks/useScrollLock"
import type { Product } from "@/lib/catalog"
import { formatCurrency } from "@/lib/format"
import styles from "./ProductModal.module.scss"

type ProductModalProps = {
  product: Product | null
  onClose: () => void
  onBuy: (product: Product, quantity: number) => void
}

/**
 * <dialog> nativo com showModal(): top layer, foco preso e o resto da página
 * inerte de graça. O framer-motion só cuida da entrada/saída; o dialog fica
 * aberto durante a animação de saída e fecha quando ela termina.
 */
export function ProductModal({ product, onClose, onBuy }: ProductModalProps) {
  return (
    <AnimatePresence>{product && <ModalContent key={product.id} product={product} onClose={onClose} onBuy={onBuy} />}</AnimatePresence>
  )
}

function ModalContent({ product, onClose, onBuy }: { product: Product } & Omit<ProductModalProps, "product">) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [quantity, setQuantity] = useState(1)
  // Lido no render, antes do commit: o autoFocus do "Fechar" já roubaria o foco no effect.
  const [trigger] = useState(() => document.activeElement as HTMLElement | null)
  const titleId = `modal-title-${product.id}`
  const descriptionId = `modal-description-${product.id}`

  useScrollLock(true)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      // Devolve o foco a quem abriu o modal (o dialog sai do DOM antes do close nativo agir).
      trigger?.focus({ preventScroll: true })
    }
  }, [trigger])

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // Esc: anima a saída em vez do fechamento seco do navegador.
        event.preventDefault()
        onClose()
      }}
    >
      <motion.div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-testid="modal-backdrop"
      >
        <motion.article
          className={styles.panel}
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <IconButton
            icon="close"
            label="Fechar"
            iconSize={15}
            className={styles.close}
            onClick={onClose}
            autoFocus
          />

          <div className={styles.media}>
            <Image src={product.photo} alt={product.name} fill sizes="(max-width: 768px) 60vw, 247px" className={styles.image} />
          </div>

          <div className={styles.info}>
            <h2 id={titleId} className={styles.title}>
              {product.name}
            </h2>
            <p className={styles.price}>{formatCurrency(product.price)}</p>

            <p id={descriptionId} className={styles.description}>
              {product.description}
            </p>
            <a href="#" className={styles.details}>
              Veja mais detalhes do produto <span aria-hidden="true">&gt;</span>
            </a>

            <div className={styles.purchase}>
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button variant="accent" size="sm" className={styles.buy} onClick={() => onBuy(product, quantity)}>
                Comprar
              </Button>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </dialog>
  )
}
