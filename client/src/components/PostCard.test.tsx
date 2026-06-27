import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "@/components/PostCard";

describe("PostCard", () => {
  it("deve exibir alerta quando usuario deslogado tenta curtir", () => {
    // Requisito: usuarios deslogados nao podem curtir posts.
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();

    render(
      <PostCard
        post={{
          id: 1,
          title: "Post de teste",
          body: "Conteudo do post",
          liked: false,
          reactions: {
            likes: 10,
            dislikes: 2,
          },
        }}
        isAuthenticated={false}
        onLike={onLike}
      />
    );

    expect(screen.getByText("Likes: 10 | Dislikes: 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining("autenticado")
    );
    expect(onLike).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
