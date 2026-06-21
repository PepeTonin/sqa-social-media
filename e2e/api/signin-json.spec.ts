import { test, expect } from "@playwright/test";
import { API_URL, ensureUser } from "../helpers/api";

const PEDRO = { email: "pedroprofessor@email.com", password: "Senha@123" };

test.describe("POST /auth/signin — JSON variants", () => {
  test.beforeAll(async ({ request }) => {
    await ensureUser(request, PEDRO);
  });

  const validBodies: Array<{ name: string; data: Record<string, unknown> }> = [
    {
      name: "minimal { email, password }",
      data: { email: PEDRO.email, password: PEDRO.password },
    },
    {
      name: "reversed key order { password, email }",
      data: { password: PEDRO.password, email: PEDRO.email },
    },
    {
      name: "extra unknown fields are ignored",
      data: {
        email: PEDRO.email,
        password: PEDRO.password,
        remember: true,
        device: "e2e",
      },
    },
  ];

  for (const { name, data } of validBodies) {
    test(`valid login: ${name}`, async ({ request }) => {
      const res = await request.post(`${API_URL}/auth/signin`, { data });

      expect(res.status(), `body "${name}" should authenticate`).toBe(200);

      const body = await res.json();

      expect(body.email).toBe(PEDRO.email);
    });
  }

  test("invalid JSON: malformed email is rejected with 422", async ({
    request,
  }) => {
    const res = await request.post(`${API_URL}/auth/signin`, {
      data: { email: "pedroprofessor", password: PEDRO.password },
    });

    expect(res.status(), "email without @ is invalid").toBe(422);

    const body = await res.json();
    
    expect(body.message).toContain("E-mail inválido");
  });
});
