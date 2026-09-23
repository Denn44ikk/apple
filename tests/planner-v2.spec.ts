import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1 });

test("day tasks are grouped by category and excluded features are absent", async ({ page }) => {
  await page.goto("/");
  const groups = page.getByTestId("grouped-task-list").locator(".task-group");
  await expect(groups).toHaveCount(3);
  await expect(groups.nth(0).locator(".task-group-heading h3")).toHaveText("Работа");
  await expect(groups.nth(0).locator(".task-copy h3")).toHaveText(["Подготовить презентацию", "Разобрать почту"]);
  await expect(groups.nth(1).locator(".task-group-heading h3")).toHaveText("Учёба");
  await expect(groups.nth(2).locator(".task-group-heading h3")).toHaveText("Дом");
  await expect(page.getByRole("button", { name: "Привычки" })).toHaveCount(0);
  await expect(page.getByText("Сон", { exact: true })).toHaveCount(0);
  const screen = page.getByTestId("device-screen");
  await expect(screen).toBeVisible();
  const box = await screen.boundingBox();
  expect(box?.width).toBe(393);
  expect(box?.height).toBe(852);
  await screen.screenshot({ path: "qa/v2-day.png" });
});

test("week percentages follow completion for each date", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("view-Неделя").click();
  const cards = page.getByTestId("week-view").locator(".week-card");
  await expect(cards).toHaveCount(7);
  await expect(cards.nth(0).locator(".day-percent")).toHaveText("100%");
  await expect(cards.nth(4).locator(".day-percent")).toHaveText("50%");
  await expect(cards.nth(6).locator(".day-percent")).toHaveText("20%");
  await page.getByRole("button", { name: "Вернуть задачу Проверить документы" }).click();
  await expect(cards.nth(0).locator(".day-percent")).toHaveText("50%");
  await expect(page.locator(".week-summary b")).toHaveText("50%");
  await page.getByRole("button", { name: "Выполнить задачу Проверить документы" }).click();
  await expect(cards.nth(0).locator(".day-percent")).toHaveText("100%");
  await page.getByTestId("device-screen").screenshot({ path: "qa/v2-week.png" });
});

test("a new task appears in its category without time", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("add-task").click();
  await page.getByTestId("task-title").fill("Заказать материалы");
  await page.getByTestId("task-category").selectOption("home");
  await expect(page.getByLabel("Время")).toHaveCount(0);
  await page.getByTestId("save-task").click();
  const home = page.locator(".task-group").filter({ has: page.locator(".task-group-heading h3", { hasText: "Дом" }) });
  await expect(home.locator(".task-copy h3")).toHaveText(["Купить продукты", "Заказать материалы"]);
});

test("a repeated task is completed separately on each day", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("add-task").click();
  await page.getByTestId("task-title").fill("Ежедневная проверка");
  await page.getByTestId("task-repeat").selectOption("daily");
  await page.getByTestId("save-task").click();
  await page.getByRole("button", { name: "Выполнить задачу Ежедневная проверка" }).click();
  await expect(page.getByRole("button", { name: "Вернуть задачу Ежедневная проверка" })).toBeVisible();
  await page.getByRole("button", { name: "Следующий день" }).click();
  await expect(page.getByRole("button", { name: "Выполнить задачу Ежедневная проверка" })).toBeVisible();
});
