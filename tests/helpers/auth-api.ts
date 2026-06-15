import {
  APIRequestContext,
  APIResponse,
  expect,
} from "@playwright/test";
import { API_URL } from "./environment";
import { generateUniqueEmail, STRONG_PASSWORD } from "./test-data";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface ApiUser {
  id: number;
  email: string;
  password?: string;
}

export interface AuthApiResult<T> {
  response: APIResponse;
  body: T;
}

export interface CreatedUser {
  credentials: UserCredentials;
  user: ApiUser;
}

async function readJson<T>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}

export async function createUser(
  request: APIRequestContext,
  credentials: UserCredentials = {
    email: generateUniqueEmail(),
    password: STRONG_PASSWORD,
  }
): Promise<CreatedUser> {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: credentials,
  });
  const body = await readJson<ApiUser>(response);

  expect(
    response.ok(),
    `Falha ao preparar usuário: HTTP ${response.status()} ${JSON.stringify(body)}`
  ).toBe(true);

  return {
    credentials,
    user: body,
  };
}

export async function loginUser(
  request: APIRequestContext,
  credentials: UserCredentials
): Promise<AuthApiResult<ApiUser | { message: string; status: number }>> {
  const response = await request.post(`${API_URL}/auth/signin`, {
    data: credentials,
  });

  return {
    response,
    body: await readJson(response),
  };
}
