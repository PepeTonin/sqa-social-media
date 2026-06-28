import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - posts", () => {
  test("retorna uma lista de posts com pelo menos um item", async () => {
    const context = await pwRequest.newContext();

    const response = await context.get(`${API_BASE}/posts`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("posts");
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);

    await context.dispose();
  });
});
