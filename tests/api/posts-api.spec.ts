import { expect, test } from "@playwright/test";

const API_URL = process.env.API_URL || "http://localhost:8080";

test("deve buscar posts pela API", async ({ request }) => {
  const response = await request.get(`${API_URL}/posts?limit=10&skip=0`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.posts)).toBe(true);
  expect(body.posts.length).toBeLessThanOrEqual(10);
});
