import { render, screen } from "@testing-library/react";
import Home from "./page";
import { AuthProvider } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

/**
 * Teste de INTEGRACAO (tela/fluxo).
 *
 * Exercita a homepage "/" completa (Header + feed de PostCards) com o contexto
 * real, mockando a borda de rede (postsService) e a navegacao.
 *
 * Requisito (feed): a homepage deve exibir os posts (titulo e corpo) vindos da
 * API.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getPosts: jest.fn(),
    getLikedPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

const mockedGetPosts = postsService.getPosts as jest.Mock;

describe("Homepage / feed de posts (integracao)", () => {
  it("renderiza os posts retornados pela API", async () => {
    mockedGetPosts.mockResolvedValueOnce({
      posts: [
        { id: 1, title: "Primeiro post", body: "Corpo 1", liked: false },
        { id: 2, title: "Segundo post", body: "Corpo 2", liked: false },
      ],
      total: 2,
      skip: 0,
      limit: 10,
    });

    render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );

    expect(await screen.findByText("Primeiro post")).toBeInTheDocument();
    expect(screen.getByText("Segundo post")).toBeInTheDocument();
  });
});
