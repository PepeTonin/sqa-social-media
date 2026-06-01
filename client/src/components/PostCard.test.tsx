import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

const post = {
  id: 1,
  title: "Primeiro post",
  body: "Conteudo do primeiro post",
  liked: false,
};

describe("PostCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza titulo, corpo e botao curtir", () => {
    // Teste unitario de componente: renderiza um card isolado com props fixas
    // Ele valida o requisito do feed exibir titulo, corpo e botao de curtir
    render(
      <PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />
    );

    expect(screen.getByText("Primeiro post")).toBeInTheDocument();
    expect(screen.getByText("Conteudo do primeiro post")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Curtir/ })).toBeInTheDocument();
  });

  test("usuario deslogado recebe alerta ao tentar curtir", () => {
    // Teste unitario de componente baseado no requisito:
    // usuario deslogado deve ver um alert nativo ao clicar em Curtir
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();

    render(
      <PostCard post={post} isAuthenticated={false} onLike={onLike} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Curtir/ }));

    expect(alertMock).toHaveBeenCalledWith(
      "Voc\u00ea precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
