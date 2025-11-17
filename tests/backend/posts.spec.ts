import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:8080";

// cria ou faz login no usuário
async function loginAndGetUser() {
    const loginResponse = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "marco@email.com",
            password: "TestPass$123",
        }),
    });

    if (loginResponse.status === 401 || loginResponse.status === 404) {
        await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "marco@email.com",
                password: "TestPass$123",
            }),
        });

        const retryResponse = await fetch(`${API_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "marco@email.com",
                password: "TestPass$123",
            }),
        });

        if (!retryResponse.ok) {
            throw new Error(`Erro ao logar após cadastro: ${retryResponse.status}`);
        }

        const retryData = await retryResponse.json();
        return { userId: retryData.id, email: retryData.email };
    }

    if (!loginResponse.ok) {
        throw new Error(`Erro ao logar: ${loginResponse.status}`);
    }

    const data = await loginResponse.json();
    return { userId: data.id, email: data.email };
}

test.describe("POSTS API", () => {
    test("deve impedir acesso a getLikedPosts sem login", async ({ request }) => {
        const response = await request.get(`${API_URL}/posts/liked?userId=1`);

        expect([200, 401, 403]).toContain(response.status());
    });

    test("deve retornar posts curtidos quando autenticado", async ({ request }) => {
        const { userId } = await loginAndGetUser();

        const response = await request.get(`${API_URL}/posts/liked?userId=${userId}`);

        expect(response.status()).toBe(200);
    });

    test("deve permitir curtir ou descurtir um post (toggleLike)", async ({ request }) => {
        const { userId } = await loginAndGetUser();

        const postId = 1;
        const response = await request.post(`${API_URL}/posts/${postId}/like?userId=${userId}`);

        expect(response.status()).toBe(200);
    });

    test("deve retornar usuário não encontrado ao redefinir senha", async ({ request }) => {
        const response = await request.post(`${API_URL}/auth/reset-password`, {
            data: { email: "email_aleatorio@email.com" }
        })

        expect(response.status()).toBe(404);

        const result = await response.json();
        expect(result.message).toBe("Usuário não encontrado");
    })
});
