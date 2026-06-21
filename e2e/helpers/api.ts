import { APIRequestContext, expect } from "@playwright/test";
import { TestUser } from "./user.factory";

export const API_URL = "http://localhost:8080";

export interface SeededUser extends TestUser {
  id: number;
}

export async function seedUser(request: APIRequestContext, user: TestUser): Promise<void> {
  const res = await request.post(`${API_URL}/auth/signup`, {
    data: { email: user.email, password: user.password },
  });

  expect(
    res.ok(),
    `seedUser failed: ${res.status()} ${await res.text()}`
  ).toBeTruthy();
}

export async function signupUser(request: APIRequestContext, user: TestUser): Promise<SeededUser> {
  const res = await request.post(`${API_URL}/auth/signup`, {
    data: { email: user.email, password: user.password },
  });

  expect(
    res.ok(),
    `signupUser failed: ${res.status()} ${await res.text()}`
  ).toBeTruthy();
  const body = await res.json();
  return { ...user, id: body.id };
}

export async function ensureUser(request: APIRequestContext, user: TestUser): Promise<void> {
  const res = await request.post(`${API_URL}/auth/signup`, {
    data: { email: user.email, password: user.password },
  });

  expect(
    res.status() === 200 || res.status() === 409,
    `ensureUser unexpected status: ${res.status()} ${await res.text()}`
  ).toBeTruthy();
}

export async function likePost(
  request: APIRequestContext, postId: number, userId: number): Promise<{ postId: number; liked: boolean }> {
  const res = await request.post(`${API_URL}/posts/${postId}/like`, {
    params: { userId },
  });

  expect(
    res.ok(),
    `likePost failed: ${res.status()} ${await res.text()}`
  ).toBeTruthy();
  return res.json();
}

export async function seedUserWithLikes(request: APIRequestContext, user: TestUser, postIds: number[]): Promise<SeededUser> {
  const seeded = await signupUser(request, user);

  for (const postId of postIds) {
    const result = await likePost(request, postId, seeded.id);

    expect(
      result.liked,
      `expected fresh like for post ${postId} to register as liked`
    ).toBe(true);
  }

  return seeded;
}
