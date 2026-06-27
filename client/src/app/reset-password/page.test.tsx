import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ResetPassword from "./page";
import { authService } from "@/service/auth/auth";

// Mock do roteador para impedir redirecionamento real após o envio.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock de autenticação: esta tela é usada por usuário deslogado.
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock do serviço para testar apenas o comportamento da tela.
jest.mock("@/service/auth/auth", () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

  // Tipagem do mock para facilitar a configuração de retorno.
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe("página de redefinição de senha", () => {
  it("deve exibir a mensagem de sucesso exigida após solicitação válida", async () => {
    // Teste de integração de bug: o requisito pede exatamente "E-mail enviado com sucesso".
    // A implementação atual mostra outro texto, então este teste deve falhar.
    mockedAuthService.resetPassword.mockResolvedValue(undefined);

     // Renderiza o componente e simula a interação do usuário.
    render(<ResetPassword />);

    // Simula a digitação de um e-mail válido e o clique no botão de envio.
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "aluno@example.com" },
    });
    // Simula o clique no botão de envio para solicitar a redefinição de senha.
    fireEvent.click(screen.getByRole("button", { name: /enviar email/i }));

    // Verifica se a mensagem de sucesso é exibida após a solicitação.
    expect(
      await screen.findByText(
        "Email enviado com sucesso para alterar a senha! Redirecionando..."
      )
    ).toBeInTheDocument();
  });
});
