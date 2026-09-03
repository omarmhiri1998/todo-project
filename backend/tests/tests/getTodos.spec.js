const { test, expect } = require("@playwright/test");

test("ADD todo", async ({ page }) => {
  test.setTimeout(30000);

  const todoText = `Playwright Todo ${Date.now()}`;

  await page.setViewportSize({
    width: 390,
    height: 700
  });

  await page.goto("http://localhost:5173");

  await page
    .getByRole("button", { name: "Add Todo" })
    .click();

  await page
    .getByLabel("Choose a category:")
    .selectOption("studys");

  await page
    .getByLabel("What do you want to do?")
    .fill(todoText);

  await page
    .getByLabel("When?")
    .fill("2026-09-10");

  await page
    .locator("#check")
    .check();

  const addButton = page.locator(
    'input[type="submit"][value="Add +"]'
  );

  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes("/todos") &&
      response.request().method() === "POST"
  );

  await addButton.click();

  const response = await responsePromise;

  expect(response.ok()).toBeTruthy();

  await expect(
    page.getByText(todoText, { exact: true })
  ).toBeVisible();

  console.log("ADD TEST PASSED");

  await page.waitForTimeout(10000);
});