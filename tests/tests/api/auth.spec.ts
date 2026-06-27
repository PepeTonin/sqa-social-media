import {
  test,
  expect,
  request as pwRequest,
  APIRequestContext,
} from "@playwright/test";

const API_BASE = "http://localhost:8080";
const VALID_PASSWORD = "Teste123@";

function uniqueEmail(prefix = "user") {
  const rand = Date.now() + Math.floor(Math.random() * 100000);
  return `${prefix}${rand}@teste.com`;
}

test.describe("API - Autenticação (caixa-preta)", () => {
  let api: APIRequestContext;

  test.beforeAll(async () => {
    api = await pwRequest.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test("POST /auth/signin retorna 200 e os dados do usuário com credenciais válidas", async () => {
    const email = uniqueEmail("signin");
    const signup = await api.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(signup.status()).toBe(200);

    const resp = await api.post("/auth/signin", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(typeof body.id).toBe("number");
    expect(body.email).toBe(email);
  });

  test("POST /auth/signup retorna 409 quando o e-mail já está cadastrado", async () => {
    const email = uniqueEmail("dup");
    const first = await api.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(first.status()).toBe(200);

    const second = await api.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(body.message).toBe("E-mail já cadastrado");
    expect(body.status).toBe(409);
  });

  test("POST /auth/signin retorna 401 quando a senha está incorreta", async () => {
    const email = uniqueEmail("wrongpass");
    await api.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });

    const resp = await api.post("/auth/signin", {
      data: { email, password: "SenhaErrada9@" },
    });
    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.message).toBe("Credenciais inválidas");
  });

  test("POST /auth/signup retorna 422 quando o e-mail é inválido", async () => {
    const resp = await api.post("/auth/signup", {
      data: { email: "email-sem-arroba", password: VALID_PASSWORD },
    });
    expect(resp.status()).toBe(422);
    const body = await resp.json();
    expect(body.message).toBe("E-mail inválido");
  });
});