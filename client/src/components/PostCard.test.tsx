import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCard from "./PostCard";
import { Post } from "@/service/types";

/**
 * Teste UNITARIO de COMPONENTE (isolado).
 *
 * Verifica o requisito do feed:
 * - usuario deslogado ao clicar em "Curtir" deve ver um alert nativo;
 * - usuario logado ao clicar em "Curtir" dispara onLike e recebe feedback
 *   visual (texto muda para "Curtido").
 */
const basePost: Post = {
  id: 1,
  title: "Titulo do post",
  body: "Corpo do post",
  reactions: { likes: 7, dislikes: 2 },
  liked: false,
};

describe("PostCard", () => {
  it("renderiza titulo, corpo e botao de curtir", () => {
    render(
      <PostCard post={basePost} isAuthenticated={false} onLike={jest.fn()} />
    );

    expect(screen.getByText("Titulo do post")).toBeInTheDocument();
    expect(screen.getByText("Corpo do post")).toBeInTheDocument();
    expect(screen.getByText("👍 7 likes")).toBeInTheDocument();
    expect(screen.getByText("👎 2 dislikes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument();
  });

  it("usuario deslogado vê alert e NAO chama onLike", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();

    render(
      <PostCard post={basePost} isAuthenticated={false} onLike={onLike} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("usuario logado chama onLike e mostra feedback de curtido", async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);

    render(
      <PostCard post={basePost} isAuthenticated={true} onLike={onLike} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(onLike).toHaveBeenCalledWith(1);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /curtido/i })).toBeInTheDocument()
    );
  });
});
