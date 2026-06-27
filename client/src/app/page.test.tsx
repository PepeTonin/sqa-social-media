import { render, screen, waitFor } from "@testing-library/react";
import Home from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

jest.mock("@/components/Header", () => {
  return function HeaderMock() {
    return <header>SQA Social Media</header>;
  };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedGetPosts = postsService.getPosts as jest.Mock;

describe("Home page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("carrega e exibe posts vindos do servico", async () => {
    // Teste de integracao de tela: renderiza a pagina Home,
    // renderiza a Home, mocka o servico de posts e verifica se o post carregado aparece no feed.
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    mockedGetPosts.mockResolvedValue({
      posts: [
        {
          id: 1,
          title: "Post vindo da API",
          body: "Texto carregado pelo feed",
          liked: false,
          likes: 8,
          dislikes: 1,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    render(<Home />);

    expect(screen.getByText("Carregando posts...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Post vindo da API")).toBeInTheDocument();
    });

    expect(screen.getByText("Texto carregado pelo feed")).toBeInTheDocument();
    expect(screen.getByText("Likes: 8")).toBeInTheDocument();
    expect(screen.getByText("Dislikes: 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Curtir/ })).toBeInTheDocument();
  });
});
