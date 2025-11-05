import { test, expect, request as pwRequest } from "@playwright/test";

const API_BASE = "http://localhost:8080";

test.describe("API - POSTS", () => {
  test("GET /posts retorna lista de posts", async () => {
    const api = await pwRequest.newContext({ baseURL: API_BASE });
    const resp = await api.get("/posts", { params: { limit: 5, skip: 0 } });
    expect(resp.status()).toBeGreaterThanOrEqual(200);
    expect(resp.status()).toBeLessThan(300);

    const data = await resp.json();
    expect(Array.isArray(data.posts)).toBeTruthy();
    expect(data.posts.length).toBeGreaterThan(0);
  });
});
