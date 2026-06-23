import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "./PostCard";
import { Post } from "@/service/types";

/**
 * Teste UNITARIO de COMPONENTE (isolado).
 *
 * Requisito (feed): para usuarios deslogados, ao clicar em "Curtir" um alert
 * nativo deve ser exibido e a acao de curtir (onLike) NAO deve ser disparada.
 */
const basePost: Post = {
  id: 1,
  title: "Titulo do post",
  body: "Corpo do post",
  liked: false,
};

describe("PostCard", () => {
  it("usuario deslogado vê alert e NAO chama onLike", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();

    render(<PostCard post={basePost} isAuthenticated={false} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
