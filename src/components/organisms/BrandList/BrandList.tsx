import { BrandCard, SectionTitle } from "@/components/molecules"
import { Reveal } from "@/components/motion/Reveal"
import { BRANDS } from "@/content/home"
import styles from "./BrandList.module.scss"

export function BrandList() {
  return (
    <section aria-labelledby="brands-title" className={styles.section}>
      <SectionTitle id="brands-title" title="Navegue por marcas" decorated={false} />
      <ul className={styles.list}>
        {BRANDS.map((brand, index) => (
          <li key={brand.name}>
            <Reveal delay={index * 0.08} offset={16}>
              <BrandCard name={brand.name} logo={brand.logo} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
