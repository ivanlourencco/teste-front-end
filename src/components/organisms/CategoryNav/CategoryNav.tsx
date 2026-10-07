import { CategoryCard } from "@/components/molecules"
import { Reveal } from "@/components/motion/Reveal"
import { CATEGORIES } from "@/content/home"
import styles from "./CategoryNav.module.scss"

/** "Compre por categoria". Tecnologia é a categoria ativa da página. */
export function CategoryNav({ activeLabel = "Tecnologia" }: { activeLabel?: string }) {
  return (
    <nav id="categorias" aria-label="Compre por categoria" className={styles.section}>
      <Reveal>
        <ul className={styles.list}>
          {CATEGORIES.map((category) => (
            <li key={category.label}>
              <CategoryCard category={category} active={category.label === activeLabel} />
            </li>
          ))}
        </ul>
      </Reveal>
    </nav>
  )
}
