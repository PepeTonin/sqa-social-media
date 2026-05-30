import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";
import { AuthProvider } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

/**
 * Teste de INTEGRACAO (tela/fluxo).
 *
 * Exercita a homepage "/" completa (Header + feed de PostCards) com o contexto
 * real, mockando a borda de rede (postsService) e a navegacao.
 *
 * Requisitos do feed:
 * - exibe os posts (titulo e corpo) vindos da API;
 * - usuario deslogado ao clicar em "Curtir" ve um alert nativo.
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

function renderHome() {
  return render(
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

describe("Homepage / feed de posts (integracao)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

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

    renderHome();

    expect(await screen.findByText("Primeiro post")).toBeInTheDocument();
    expect(screen.getByText("Segundo post")).toBeInTheDocument();
  });

  it("usuario deslogado vê alert ao tentar curtir um post do feed", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    mockedGetPosts.mockResolvedValueOnce({
      posts: [{ id: 1, title: "Primeiro post", body: "Corpo 1", liked: false }],
      total: 1,
      skip: 0,
      limit: 10,
    });

    renderHome();

    await screen.findByText("Primeiro post");
    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        "Você precisa estar autenticado para curtir posts!"
      )
    );
    expect(postsService.toggleLikePost).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
