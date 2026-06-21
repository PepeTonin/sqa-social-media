import { test, expect, APIRequestContext } from "@playwright/test";
import { API_URL } from "../helpers/api";

const USER_ID = 1;
const POST_ID = 7;

async function likedPostIds(request: APIRequestContext): Promise<number[]> {
  const res = await request.get(`${API_URL}/posts/liked`, {
    params: { userId: USER_ID, limit: 1000, skip: 0 },
  });

  expect(res.status()).toBe(200);

  return (await res.json()).posts.map((p: { id: number }) => p.id);
}

async function toggle(request: APIRequestContext): Promise<boolean> {
  const res = await request.post(`${API_URL}/posts/${POST_ID}/like`, {
    params: { userId: USER_ID },
  });
  
  expect(res.status()).toBe(200);

  const body = await res.json();

  expect(body.postId).toBe(POST_ID);

  return body.liked;
}

test.describe("POST /posts/{id}/like — like then unlike (user 1)", () => {
  test.beforeEach(async ({ request }) => {
    if ((await likedPostIds(request)).includes(POST_ID)) {
      await toggle(request);
    }
    expect(await likedPostIds(request)).not.toContain(POST_ID);
  });

  test("liking registers, unliking removes", async ({ request }) => {
    expect(await toggle(request), "first toggle should like").toBe(true);

    expect(
      await likedPostIds(request),
      "post should appear in liked list"
    ).toContain(POST_ID);

    expect(await toggle(request), "second toggle should unlike").toBe(false);

    expect(
      await likedPostIds(request),
      "post should be gone from liked list"
    ).not.toContain(POST_ID);
  });
});
