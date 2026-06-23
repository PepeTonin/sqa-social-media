import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import SignIn from "./page";
import { AuthProvider } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

/**
 * Teste de INTEGRACAO (tela/fluxo).
 *
 * Exercita a pagina de login completa (Header + Input + Button + form) com o
 * contexto de autenticacao real, mockando a borda de rede (authService) e a
 * navegacao (next/navigation).
 *
 * Requisito (signin): "Caso as credenciais estejam incorretas, a mensagem de
 * erro 'Credenciais invalidas' deve ser exibida."
 */
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

const mockedSignIn = authService.signIn as jest.Mock;

/**
 * O Header (deslogado) tambem tem um botao "Entrar"; selecionamos
 * especificamente o botao de submit do formulario.
 */
function getSubmitButton() {
  return screen
    .getAllByRole("button", { name: "Entrar" })
    .find((btn) => btn.getAttribute("type") === "submit") as HTMLElement;
}

describe("Tela de login (integracao)", () => {
  it("mostra 'Credenciais inválidas' quando a API retorna 401", async () => {
    const error = new AxiosError("Request failed", "ERR_BAD_REQUEST");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.response = { data: { message: "Credenciais inválidas" } } as any;
    mockedSignIn.mockRejectedValueOnce(error);

    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "SenhaErrada@9" },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() =>
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument()
    );
    expect(pushMock).not.toHaveBeenCalledWith("/");
  });
});
