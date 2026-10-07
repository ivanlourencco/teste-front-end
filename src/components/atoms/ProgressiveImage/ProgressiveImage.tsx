"use client"

import Image from "next/image"
import { clsx } from "clsx"
import { useState } from "react"
import { Skeleton } from "../Skeleton/Skeleton"
import styles from "./ProgressiveImage.module.scss"

type ProgressiveImageProps = {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  fit?: "contain" | "cover"
  className?: string
}

/**
 * Imagem que entra com fade sobre um skeleton enquanto carrega, sem salto de
 * layout (ocupa o pai com `fill`). Adaptado do ProgressiveImage do ij-ecommerce.
 */
export function ProgressiveImage({ src, alt, sizes, priority = false, fit = "cover", className }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={clsx(styles.frame, className)} data-loaded={loaded || undefined}>
      {!loaded && <Skeleton className={styles.placeholder} />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={clsx(styles.image, styles[fit])}
      />
    </span>
  )
}
