import { test, expect } from "@playwright/test";
import { makeUser } from "../helpers/user.factory";
import { API_URL, seedUser } from "../helpers/api";


test.describe("POST /auth/reset-password — black box", () => {
  test("existing user: resets and returns success message", async ({
    request,
  }) => {
    const user = makeUser();
    await seedUser(request, user);

    const res = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: user.email },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body.message).toContain("sucesso");
  });

  test("malformed email: rejected with 422", async ({ request }) => {
    const res = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: "not-an-email" },
    });

    expect(res.status(), "email without @ is invalid").toBe(422);

    const body = await res.json();

    expect(body.message).toContain("E-mail inválido");
  });

  test("unknown user: rejected with 404", async ({ request }) => {
    const ghost = makeUser();

    const res = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: ghost.email },
    });

    expect(res.status(), "valid format but no account").toBe(404);
    
    const body = await res.json();
    
    expect(body.message).toContain("não encontrado");
  });

  test("missing email field: rejected (not 200)", async ({ request }) => {
    const res = await request.post(`${API_URL}/auth/reset-password`, {
      data: {},
    });

    expect(res.status(), "absent email cannot succeed").not.toBe(200);
  });
});
