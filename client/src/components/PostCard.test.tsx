import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

const post = {
  id: 1,
  title: "Titulo do post",
  body: "Conteudo do post",
  liked: false,
  reactions: {
    likes: 12,
    dislikes: 3,
  },
};

describe("PostCard", () => {
  it("deve exibir likes e dislikes do post", () => {
    const onLike = jest.fn();

    render(<PostCard post={post} isAuthenticated={true} onLike={onLike} />);

    expect(screen.getByText("Likes: 12")).toBeInTheDocument();
    expect(screen.getByText("Dislikes: 3")).toBeInTheDocument();
  });

  it("deve alertar quando usuario deslogado tenta curtir um post", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();

    render(<PostCard post={post} isAuthenticated={false} onLike={onLike} />);
    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();
  });
});
