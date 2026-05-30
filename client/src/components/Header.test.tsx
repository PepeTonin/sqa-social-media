import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Teste UNITARIO de COMPONENTE (isolado).
 *
 * Requisito de navegacao/header:
 * - deslogado: botoes "Entrar" e "Criar Conta";
 * - logado: botoes "Posts Curtidos" e "Sair".
 *
 * useRouter e useAuth sao mockados para isolar o componente.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe("Header", () => {
  it("sempre exibe o titulo 'SQA Social Media'", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn() });
    render(<Header />);
    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
  });

  it("usuario deslogado vê 'Entrar' e 'Criar Conta'", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn() });
    render(<Header />);

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar Conta" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sair" })).not.toBeInTheDocument();
  });

  it("usuario logado vê 'Posts Curtidos' e 'Sair'", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
    render(<Header />);

    expect(
      screen.getByRole("button", { name: "Posts Curtidos" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Entrar" })).not.toBeInTheDocument();
  });
});
