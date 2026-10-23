import { test, expect } from "@playwright/test";
async function setup(page, content) {
  await page.route("**/src/auth.mjs", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'export const authConfigured=true; export const initializeSession=async()=>true; export const getSession=async()=>({token:"synthetic-test-token",tenantId:"tenant-a"}); export const login=async()=>{}; export const logout=async()=>{};',
    }),
  );
  await page.route("**/api/v1/marketing/**", (route) =>
    route.fulfill({
      json: new URL(route.request().url()).pathname.endsWith("/projects")
        ? [
            {
              id: "project-1",
              name: "Saved funnel",
              kind: "react-flow",
              version: 1,
            },
          ]
        : {
            id: "project-1",
            name: "Saved funnel",
            kind: "react-flow",
            version: 1,
            content,
          },
    }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("combobox", { name: "Saved projects" }),
  ).toBeEnabled();
}
test("loads and saves a visual funnel through the gateway", async ({
  page,
}) => {
  await setup(page, {
    nodes: [
      {
        id: "landing",
        position: { x: 10, y: 10 },
        data: { label: "Campaign signup" },
      },
    ],
    edges: [],
  });
  await page
    .getByRole("combobox", { name: "Saved projects" })
    .selectOption("project-1");
  await expect(
    page.locator(".react-flow__node").getByText("Campaign signup"),
  ).toBeVisible();
  let request;
  await page.route(
    "**/api/v1/marketing/workspaces/tenant-a/projects/project-1",
    async (route) => {
      request = route.request().postDataJSON();
      await route.fulfill({
        json: {
          id: "project-1",
          kind: "react-flow",
          name: request.name,
          version: 2,
          content: request.content,
        },
      });
    },
  );
  await page.getByRole("button", { name: "Save project" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved version 2.");
  expect(request.version).toBe(1);
  expect(request.content.nodes[0].data.label).toBe("Campaign signup");
});
test("malformed saved graph leaves the editor usable", async ({ page }) => {
  await setup(page, { nodes: [null], edges: [] });
  await page
    .getByRole("combobox", { name: "Saved projects" })
    .selectOption("project-1");
  await expect(page.getByRole("status")).toContainText("Invalid");
  await expect(page.locator(".react-flow__node")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Save project" }),
  ).toBeEnabled();
});
