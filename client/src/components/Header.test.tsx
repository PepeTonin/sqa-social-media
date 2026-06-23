import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Teste UNITARIO de COMPONENTE (isolado).
 *
 * Requisito (header): para usuarios deslogados, devem aparecer os botoes
 * "Entrar" e "Criar Conta". useRouter e useAuth sao mockados para isolar o
 * componente.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe("Header", () => {
  it("usuario deslogado vê 'Entrar' e 'Criar Conta'", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn() });

    render(<Header />);

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar Conta" })).toBeInTheDocument();
  });
});
