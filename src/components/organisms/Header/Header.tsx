import { clsx } from "clsx"
import { Icon, Logo } from "@/components/atoms"
import { BenefitItem, SearchBar } from "@/components/molecules"
import { BENEFITS, MAIN_NAV } from "@/content/home"
import { CartLink } from "./CartLink"
import styles from "./Header.module.scss"

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <ul className={styles.benefits} aria-label="Vantagens da loja">
          {BENEFITS.map((benefit) => (
            <BenefitItem key={benefit.highlight} {...benefit} />
          ))}
        </ul>

        <div className={styles.main}>
          <Logo priority />
          <SearchBar className={styles.search} />
          <ul className={styles.actions}>
            <li>
              <a href="#" className={styles.action} aria-label="Meus pedidos">
                <Icon name="box" size={24} />
              </a>
            </li>
            <li>
              <a href="#" className={styles.action} aria-label="Favoritos">
                <Icon name="heart" size={32} />
              </a>
            </li>
            <li>
              <a href="#" className={styles.action} aria-label="Minha conta">
                <Icon name="user" size={32} />
              </a>
            </li>
            <li>
              <CartLink className={styles.action} />
            </li>
          </ul>
        </div>

        <nav aria-label="Departamentos" className={styles.nav}>
          <ul className={styles.navList}>
            {MAIN_NAV.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={clsx(styles.navLink, link.highlight && styles.highlight)}>
                  {link.icon && <Icon name={link.icon} size={20} />}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
