import { expect, test } from "@playwright/test";
import { createUser, loginUser } from "../../helpers/auth-api";
import { API_URL } from "../../helpers/environment";
import {
  generateUniqueEmail,
  STRONG_PASSWORD,
  WRONG_STRONG_PASSWORD,
} from "../../helpers/test-data";

interface UserResponse {
  id: number;
  email: string;
  password?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

test.describe("API de autenticação", () => {
  test("cadastro com dados válidos retorna usuário criado", async ({
    request,
  }) => {
    // Arrange
    const credentials = {
      email: generateUniqueEmail("qa-signup"),
      password: STRONG_PASSWORD,
    };

    // Act
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: credentials,
    });
    const body = (await response.json()) as UserResponse;

    // Assert
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: credentials.email,
      })
    );
    expect(body.id).toBeGreaterThan(0);
  });

  test("login com credenciais válidas retorna o usuário autenticado", async ({
    request,
  }) => {
    // Arrange
    const created = await createUser(request, {
      email: generateUniqueEmail("qa-signin"),
      password: STRONG_PASSWORD,
    });

    // Act
    const { response, body } = await loginUser(request, created.credentials);

    // Assert
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body).toEqual(
      expect.objectContaining({
        id: created.user.id,
        email: created.credentials.email,
      })
    );
    expect((body as UserResponse).id).toBeGreaterThan(0);
  });

  test("BUG CONHECIDO: cadastro duplicado retorna 409 e mensagem contratual", async ({
    request,
  }) => {
    // Arrange
    const created = await createUser(request, {
      email: generateUniqueEmail("qa-duplicate"),
      password: STRONG_PASSWORD,
    });

    // Act
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: created.credentials,
    });
    const body = (await response.json()) as ErrorResponse;

    // Assert
    expect(response.status()).toBe(409);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body.status).toBe(409);
    // BUG DOCUMENTADO: o requisito exige exatamente "E-mail já cadastrado".
    expect(body.message).toBe("E-mail já cadastrado");
  });

  test("redefinição para usuário inexistente retorna 404", async ({
    request,
  }) => {
    // Arrange
    const email = generateUniqueEmail("qa-reset-missing");

    // Act
    const response = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email },
    });
    const body = (await response.json()) as ErrorResponse;

    // Assert
    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body).toEqual({
      message: "Usuário não encontrado",
      status: 404,
    });
  });

  test("login com senha forte incorreta retorna 401", async ({ request }) => {
    // Arrange
    const created = await createUser(request, {
      email: generateUniqueEmail("qa-invalid-login"),
      password: STRONG_PASSWORD,
    });

    // Act
    const { response, body } = await loginUser(request, {
      email: created.credentials.email,
      password: WRONG_STRONG_PASSWORD,
    });

    // Assert
    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(body).toEqual({
      message: "Credenciais inválidas",
      status: 401,
    });
  });
});
