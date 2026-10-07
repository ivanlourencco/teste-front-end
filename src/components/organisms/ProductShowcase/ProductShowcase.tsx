"use client"

import { clsx } from "clsx"
import { useCallback, useId, useMemo, useState } from "react"
import { CategoryTabs, SectionTitle } from "@/components/molecules"
import { Reveal } from "@/components/motion/Reveal"
import { CATEGORY_TABS, filterByCategory, type CategoryTab, type Product } from "@/lib/catalog"
import { useCart } from "@/providers/CartProvider"
import { ProductCarousel } from "../ProductCarousel/ProductCarousel"
import { ProductModal } from "../ProductModal/ProductModal"
import styles from "./ProductShowcase.module.scss"

type ProductShowcaseProps = {
  id?: string
  title?: string
  products: readonly Product[]
  /** Vitrine principal: abas de categoria. As demais mostram "Ver todos". */
  withTabs?: boolean
  priority?: boolean
  className?: string
}

export function ProductShowcase({
  id,
  title = "Produtos relacionados",
  products,
  withTabs = false,
  priority = false,
  className,
}: ProductShowcaseProps) {
  const uid = useId().replace(/:/g, "")
  const headingId = `${uid}-title`
  const panelId = `${uid}-panel`
  const [tab, setTab] = useState<CategoryTab["id"]>(withTabs ? "celular" : "todos")
  const [selected, setSelected] = useState<Product | null>(null)
  const { addItem } = useCart()

  const visible = useMemo(() => filterByCategory(products, tab), [products, tab])
  const activeLabel = CATEGORY_TABS.find((item) => item.id === tab)?.label ?? ""

  const handleBuy = useCallback(
    (product: Product, quantity: number) => {
      addItem(product, quantity)
      setSelected(null)
    },
    [addItem],
  )

  return (
    <section id={id} aria-labelledby={headingId} className={clsx(styles.showcase, className)}>
      <Reveal>
        <SectionTitle
          id={headingId}
          title={title}
          action={withTabs ? undefined : { label: "Ver todos", href: "#ofertas" }}
        />

        {withTabs && (
          <div className={styles.tabs}>
            <CategoryTabs
              tabs={CATEGORY_TABS}
              active={tab}
              onChange={setTab}
              panelId={panelId}
              idPrefix={uid}
              label="Categorias de produtos"
            />
          </div>
        )}

        <div
          id={panelId}
          className={styles.panel}
          {...(withTabs ? { role: "tabpanel", "aria-labelledby": `${uid}-tab-${tab}` } : {})}
        >
          <ProductCarousel
            products={visible}
            onSelect={setSelected}
            listKey={tab}
            label={withTabs ? `${title}: ${activeLabel}` : title}
            priority={priority}
          />
        </div>
      </Reveal>

      <ProductModal product={selected} onClose={() => setSelected(null)} onBuy={handleBuy} />
    </section>
  )
}
