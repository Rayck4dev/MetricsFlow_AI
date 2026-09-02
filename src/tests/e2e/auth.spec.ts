import { test, expect } from "@playwright/test";

test.describe("Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("deve exibir a página de login", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Bem-vindo de volta",
      }),
    ).toBeVisible();

    await expect(page.getByLabel("E-mail")).toBeVisible();

    await expect(page.locator("#password")).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Entrar na plataforma",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Continuar com Google",
      }),
    ).toBeVisible();
  });

  test("deve exigir e-mail e senha", async ({ page }) => {
    const emailInput = page.getByLabel("E-mail");
    const passwordInput = page.locator("#password");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    await expect(emailInput).toHaveAttribute("required", "");

    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("deve permitir mostrar e ocultar a senha", async ({ page }) => {
    const passwordInput = page.locator("#password");

    await expect(passwordInput).toHaveAttribute("type", "password");

    await page
      .getByRole("button", {
        name: "Mostrar senha",
      })
      .click();

    await expect(passwordInput).toHaveAttribute("type", "text");

    await page
      .getByRole("button", {
        name: "Ocultar senha",
      })
      .click();

    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("deve preencher e-mail e senha", async ({ page }) => {
    const emailInput = page.getByLabel("E-mail");
    const passwordInput = page.locator("#password");

    await emailInput.fill("teste@example.com");

    await passwordInput.fill("senha-de-teste");

    await expect(emailInput).toHaveValue("teste@example.com");

    await expect(passwordInput).toHaveValue("senha-de-teste");
  });

  test("deve navegar para recuperação de senha", async ({ page }) => {
    await page
      .getByRole("link", {
        name: "Esqueci minha senha",
      })
      .click();

    await expect(page).toHaveURL(/\/recuperar-senha$/);
  });

  test("deve navegar para cadastro", async ({ page }) => {
    await page
      .getByRole("link", {
        name: "Criar minha conta grátis",
      })
      .click();

    await expect(page).toHaveURL(/\/cadastro$/);
  });
});

test.describe("Login real", () => {
  test("deve realizar login com uma conta de teste", async ({ page }) => {
    const email = process.env.E2E_EMAIL;

    const password = process.env.E2E_PASSWORD;

    test.skip(
      !email || !password,
      "E2E_EMAIL e E2E_PASSWORD não configurados.",
    );

    await page.goto("/login");

    await page.getByLabel("E-mail").fill(email!);

    await page.locator("#password").fill(password!);

    await page
      .getByRole("button", {
        name: "Entrar na plataforma",
      })
      .click();

    await expect(page).toHaveURL(/\/dashboard/, {
      timeout: 15_000,
    });
  });
});
