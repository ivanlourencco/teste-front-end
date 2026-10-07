import { expect, test } from "@playwright/test"

test.describe("Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("tem SEO básico e estrutura semântica", async ({ page }) => {
    await expect(page).toHaveTitle(/Econverse/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /frete grátis/i)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Venha conhecer nossas promoções")
    await expect(page.getByRole("banner")).toBeVisible()
    await expect(page.getByRole("main")).toBeVisible()
    await expect(page.getByRole("contentinfo")).toBeVisible()
    await expect(page.getByRole("search")).toBeVisible()

    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}")
    expect(jsonLd["@type"]).toBe("ItemList")
    expect(jsonLd.itemListElement.length).toBeGreaterThan(0)
  })

  test("renderiza a vitrine com os produtos do JSON no HTML do servidor", async ({ request }) => {
    const html = await (await request.get("/")).text()
    expect(html).toContain("R$ 15.000,00")
  })

  test("abre o modal do produto clicado e fecha com Esc", async ({ page }) => {
    const showcase = page.locator("#ofertas")
    const card = showcase.getByRole("article").first()
    const name = (await card.getByRole("heading", { level: 3 }).textContent())?.trim() ?? ""

    await card.getByRole("button", { name: `Comprar ${name}` }).click()

    const dialog = page.getByRole("dialog", { name })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused()

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
  })

  test("compra pelo modal e atualiza o carrinho", async ({ page }) => {
    await page.locator("#ofertas").getByRole("article").first().getByRole("button", { name: /^Comprar / }).click()

    const dialog = page.getByRole("dialog")
    await dialog.getByRole("button", { name: "Aumentar quantidade" }).click()
    await dialog.getByRole("button", { name: "Aumentar quantidade" }).click()
    await expect(dialog.getByText("03")).toBeVisible()
    await dialog.getByRole("button", { name: "Comprar", exact: true }).click()

    await expect(dialog).toBeHidden()
    await expect(page.getByRole("link", { name: "Carrinho, 3 itens" })).toBeVisible()
    await expect(page.getByTestId("cart-count")).toHaveText("3")
  })

  test("troca de aba filtra a vitrine", async ({ page }) => {
    const showcase = page.locator("#ofertas")
    await expect(showcase.getByRole("article").first()).toBeVisible()

    await showcase.getByRole("tab", { name: "TVs" }).click()
    await expect(showcase.getByText("Nenhum produto encontrado nesta categoria.")).toBeVisible()

    await showcase.getByRole("tab", { name: "Ver todos" }).click()
    await expect(showcase.getByRole("article").first()).toBeVisible()
  })

  test("navega pelo carrossel com as setas", async ({ page, isMobile }) => {
    test.skip(isMobile, "no mobile o carrossel é por swipe e as setas ficam ocultas")
    const showcase = page.locator("#ofertas")
    const prev = showcase.getByRole("button", { name: "Produtos anteriores" })
    const next = showcase.getByRole("button", { name: "Próximos produtos" })
    const track = showcase.getByRole("list", { name: /Produtos relacionados/ })

    await expect(prev).toBeDisabled()
    await next.click()
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    await expect(prev).toBeEnabled()
  })

  test("valida e envia a newsletter", async ({ page }) => {
    const form = page.getByRole("region", { name: "Inscreva-se na nossa newsletter" })

    await form.getByRole("button", { name: "Inscrever" }).click()
    await expect(form.getByText("Informe seu nome.")).toBeVisible()
    await expect(form.getByLabel("Nome")).toBeFocused()

    await form.getByLabel("Nome").fill("Ivan")
    await form.getByLabel("E-mail").fill("ivan@exemplo.com")
    await form.getByText("Aceito os termos e condições").click()
    await form.getByRole("button", { name: "Inscrever" }).click()

    await expect(form.getByText(/Inscrição confirmada/)).toBeVisible()
  })

  test("não gera rolagem horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
