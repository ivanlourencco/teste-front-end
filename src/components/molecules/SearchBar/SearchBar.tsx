import { clsx } from "clsx"
import { Icon } from "@/components/atoms"
import styles from "./SearchBar.module.scss"

/** GET /busca?q= — funciona sem JS; a rota de busca fica para a loja real. */
export function SearchBar({ className }: { className?: string }) {
  return (
    <form role="search" action="/busca" method="get" className={clsx(styles.search, className)}>
      <label htmlFor="site-search" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="O que você está buscando?"
        autoComplete="off"
        enterKeyHint="search"
        className={styles.input}
      />
      <button type="submit" className={styles.submit} aria-label="Buscar">
        <Icon name="search" size={28} />
      </button>
    </form>
  )
}
