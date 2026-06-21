import { test, expect } from "@playwright/test";
import { makeUser } from "../helpers/user.factory";
import { API_URL, seedUserWithLikes } from "../helpers/api";

test.describe("GET /posts/liked — black box", () => {
  test("attempt 1 — no limit, no skip: returns one liked post", async ({
    request,
  }) => {
    const user = await seedUserWithLikes(request, makeUser(), [1]);

    const res = await request.get(`${API_URL}/posts/liked`, {
      params: { userId: user.id },
    });

    expect(res.status(), "request should succeed").toBe(200);

    const body = await res.json();
    
    expect(body.posts, "exactly one liked post expected").toHaveLength(1);
    expect(body.posts[0].id).toBe(1);
    expect(body.posts[0].liked).toBe(true);
  });

  test("attempt 2 — limit=100, skip=1: returns one liked post", async ({
    request,
  }) => {
    const user = await seedUserWithLikes(request, makeUser(), [1, 2]);

    const res = await request.get(`${API_URL}/posts/liked`, {
      params: { userId: user.id, limit: 100, skip: 1 },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body.posts, "skip=1 over two likes leaves one").toHaveLength(1);
    expect(body.posts[0].id).toBe(2);
    expect(body.skip).toBe(1);
    expect(body.limit).toBe(100);
  });

  test("attempt 3 — sem userId: rejected with 400", async ({ request }) => {
    const res = await request.get(`${API_URL}/posts/liked`);

    expect(
      res.status(),
      "userId is a required param; omitting it must fail"
    ).toBe(400);
  });

  test("attempt 4 — userId, limit=1, skip=1: returns one liked post", async ({
    request,
  }) => {
    const user = await seedUserWithLikes(request, makeUser(), [1, 2]);

    const res = await request.get(`${API_URL}/posts/liked`, {
      params: { userId: user.id, limit: 1, skip: 1 },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    
    expect(body.posts, "limit=1 skip=1 yields one post").toHaveLength(1);
    expect(body.posts[0].id).toBe(2);
    expect(body.limit).toBe(1);
    expect(body.skip).toBe(1);
  });
});
