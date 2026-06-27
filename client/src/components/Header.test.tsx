import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
  }),
}));

describe("Header", () => {
  it("deve exibir Entrar e Criar Conta para usuario deslogado", () => {
    // Teste unitario de componente: renderiza o Header isolado com autenticacao mockada.
    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
  });
});
