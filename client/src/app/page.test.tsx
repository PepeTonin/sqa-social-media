import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { postsService } from "@/service/posts/posts";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    });
  });

  it("deve carregar e exibir o feed de posts", async () => {
    // Teste de integracao: pagina Home renderiza Header, chama servico e exibe PostCard.
    (postsService.getPosts as jest.Mock).mockResolvedValue({
      posts: [
        {
          id: 1,
          title: "Primeiro post",
          body: "Conteudo do primeiro post",
          liked: false,
          reactions: {
            likes: 7,
            dislikes: 1,
          },
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    render(<Home />);

    expect(screen.getByText("Carregando posts...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Primeiro post")).toBeInTheDocument();
    });

    expect(screen.getByText("Conteudo do primeiro post")).toBeInTheDocument();
    expect(screen.getByText("Likes: 7 | Dislikes: 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument();
  });
});
