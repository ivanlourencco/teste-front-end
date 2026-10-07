# Teste Econverse · Front-End

Home da Econverse construída a partir do [layout no Figma](https://www.figma.com/file/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=0%3A1): vitrine de produtos alimentada pelo [JSON oficial](https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json) e modal com as informações do produto clicado.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Sass (CSS Modules) · Framer Motion · Jest + Testing Library · Playwright.

Nenhuma biblioteca de UI (Bootstrap, Tailwind, shadcn, Radix etc.). Os componentes, estilos e ícones foram feitos do zero, e os ícones são os SVGs exportados do próprio Figma.

## Como rodar

Requisitos: Node.js 20.9+ e npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## Testes e qualidade

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes unitários e de integração (Jest + Testing Library) |
| `npm run test:coverage` | Os mesmos testes, com relatório de cobertura |
| `npm run e2e` | E2E com Playwright no build de produção, em desktop 1440 e mobile (Pixel 7) |
| `npm run lint` | ESLint (regras do Next + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate` | lint + typecheck + testes + build |

Na primeira vez que for rodar o E2E, instale o navegador com `npx playwright install chromium`.

## Arquitetura

```
src/
├── app/                 # layout (fontes, SEO, providers), page (busca no servidor), robots, sitemap
├── components/
│   ├── atoms/           # Button, IconButton, Icon, Logo, TextField, Checkbox
│   ├── molecules/       # ProductCard, ProductPrice, CategoryTabs, QuantitySelector, SearchBar...
│   ├── organisms/       # Header, HeroBanner, ProductShowcase, ProductCarousel, ProductModal, Newsletter, Footer...
│   ├── templates/       # HomeTemplate: ordem e ritmo das seções
│   └── motion/          # Reveal (entrada ao rolar)
├── content/             # textos/links estáticos da home (fora dos componentes)
├── hooks/               # useCarousel, useNewsletterForm, useScrollLock
├── lib/                 # domínio puro e testável: catalog, format, validation, seo
├── providers/           # CartProvider (useReducer + context) e MotionConfig
├── services/            # getProducts(): fetch + validação do JSON
└── styles/              # tokens do Figma, mixins e estilos globais
```

Os componentes seguem **Atomic Design**. Cada um tem a própria pasta, com `.tsx` e `.module.scss`, e o teste fica ao lado quando há lógica. As regras de negócio ficam em `lib/` como funções puras: os componentes só montam a tela e os hooks guardam o estado.

### Decisões

- **Dados no servidor.** `page.tsx` busca o JSON no servidor com ISR de 1 h. O HTML já sai com a vitrine (bom para SEO) e não há loading no cliente. Se a API falhar ou devolver dados inválidos, a vitrine mostra o estado vazio e a página continua de pé.
- **Validação do payload.** `parseProducts` usa type guards e descarta os itens malformados em vez de quebrar a página. O `id` é gerado a partir do nome + índice, porque o JSON não traz um id.
- **Categorias das abas.** O JSON não informa categoria, então ela é inferida pelo nome (`inferCategory`). Os produtos atuais são todos iPhones: aparecem em **Celular** e **Ver todos**, e as outras abas mostram o estado vazio.
- **Preço.** `price` é interpretado como reais (15000 → R$ 15.000,00). O parcelamento usa 2x sem juros, como no layout, e arredonda para baixo. O preço "de" (riscado) só aparece se existir: o JSON não traz esse valor, e inventar preço seria pior do que omitir a linha. A altura do card é preservada.
- **Modal.** Usa o `<dialog>` nativo com `showModal()`, o que dá top layer, foco preso e o resto da página inerte sem biblioteca. Fecha com Esc, com clique fora e no X, e devolve o foco a quem abriu. O Framer Motion anima a entrada e a saída.
- **Carrossel.** É scroll nativo com `scroll-snap`, então swipe e inércia vêm do navegador. As setas avançam uma página e desabilitam nas pontas. Um `IntersectionObserver` tira a sombra dos cards fora da janela, para ela não "vazar" na borda.
- **Carrinho.** O botão Comprar do modal adiciona a quantidade escolhida. O badge do header atualiza, e um `aria-live` anuncia a adição para leitores de tela.
- **Pixel perfect.** As medidas, cores, fontes (Poppins, Work Sans, Outfit), sombras e degradês vêm da API do Figma e estão em `styles/abstracts/_tokens.scss`. Em 1440 px, a página tem a mesma altura do frame Home (4660 px).
- **Animações.** Entrada do hero em sequência, seções aparecendo ao rolar, troca de aba com transição, indicador de aba deslizante e hovers nos cards, categorias e marcas. Tudo respeita `prefers-reduced-motion`.

### Acessibilidade e SEO

- HTML semântico: `header`, `nav`, `main`, `section` com `aria-labelledby`, `article`, `footer`, `form role="search"`. Hierarquia h1 → h2 → h3.
- Abas no padrão WAI-ARIA (setas, Home e End), link "pular para o conteúdo", foco visível, rótulos em todos os botões de ícone e validação acessível na newsletter (`aria-invalid`, `role="alert"` e foco no primeiro campo inválido).
- Metadata completa (title, description, Open Graph, canonical), `robots.txt`, `sitemap.xml` e JSON-LD `ItemList`/`Product` da vitrine.
- Imagens com `next/image` (AVIF/WebP, `sizes` responsivos, prioridade no que fica acima da dobra) e fontes com `next/font`, sem layout shift.

## Responsividade

O layout de referência é desktop (1440). Abaixo disso, o header empilha a busca, os menus e as abas rolam na horizontal, o carrossel mostra 3, 2 ou ~1,3 cards (com swipe no mobile), os banners ficam um por linha e a newsletter e o rodapé empilham.
