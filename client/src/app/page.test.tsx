import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "./page";
import { postsService } from "@/service/posts/posts";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedPostsService = postsService as jest.Mocked<typeof postsService>;

const basePost = {
  id: 1,
  title: "Post carregado",
  body: "Corpo",
  liked: false,
  reactions: {
    likes: 25,
    dislikes: 4,
  },
};

describe("pagina inicial", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar posts carregados da API com reacoes", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockedPostsService.getPosts.mockResolvedValue({
      posts: [basePost],
      total: 1,
      skip: 0,
      limit: 10,
    });

    render(<Home />);

    expect(await screen.findByText("Post carregado")).toBeInTheDocument();
    expect(screen.getByText("Corpo")).toBeInTheDocument();
    expect(screen.getByText("Likes: 25")).toBeInTheDocument();
    expect(screen.getByText("Dislikes: 4")).toBeInTheDocument();
  });

  it("deve alternar feedback visual quando usuario logado curte um post", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 10, email: "aluno@example.com" },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockedPostsService.getPosts.mockResolvedValue({
      posts: [{ ...basePost, title: "Post para curtir" }],
      total: 1,
      skip: 0,
      limit: 10,
    });
    mockedPostsService.toggleLikePost.mockResolvedValue(undefined);

    render(<Home />);

    const likeButton = await screen.findByRole("button", { name: /curtir/i });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /curtido/i })
      ).toBeInTheDocument();
    });
  });
});
