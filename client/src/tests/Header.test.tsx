import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usuário deslogado", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });
    });

    it("deve exibir título SQA Social Media e botões Entrar e Criar conta", () => {
      render(<Header />);

      expect(
        screen.getByRole("heading", { name: "SQA Social Media" })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Entrar" })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Criar conta" })
      ).toBeInTheDocument();

      expect(
          screen.queryByRole("button", { name: "Posts Curtidos" })
      ).not.toBeInTheDocument();
    });
  });

  describe("usuário logado", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: "marcelo@email.com" },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
      });
    });

    it("deve exibir Posts Curtidos e Sair, sem Entrar nem Criar Conta", () => {
      render(<Header />);

      expect(
        screen.getByRole("button", { name: "Posts Curtidos" })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Sair" })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: "Entrar" })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: "Criar conta" })
      ).not.toBeInTheDocument();
    });
  });
});
