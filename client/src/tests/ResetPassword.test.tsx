import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetPassword from "@/app/reset-password/page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";
import { AxiosError } from "axios";

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

jest.mock("../service/auth/auth", () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.Mock;
const mockResetPassword = authService.resetPassword as jest.Mock;

describe("redefinicaoDeSenhaComEmailNaoCadastradoDeveExibirErro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it("email não cadastrado deve exibir mensagem Usuário não encontrado", async () => {
    const erroAxios = new AxiosError(
      "Not Found",
      "ERR_BAD_RESPONSE",
      undefined,
      undefined,
      {
        status: 404,
        statusText: "Not Found",
        data: { message: "Usuário não encontrado" },
        headers: {},
        config: { headers: {} } as never,
      } as never
    );
    mockResetPassword.mockRejectedValue(erroAxios);

    render(<ResetPassword />);

    const campoEmail = screen.getByRole("textbox");
    fireEvent.change(campoEmail, {
      target: { value: "naoexiste@email.com" },
    });
    const botaoEnviar = screen.getByRole("button", { name: /enviar email/i });
    fireEvent.click(botaoEnviar);

    expect(
      await screen.findByText("Usuário não encontrado")
    ).toBeInTheDocument();
  });

  it("email cadastrado deve exibir mensagem E-mail enviado com sucesso", async () => {
    mockResetPassword.mockResolvedValue(undefined);

    render(<ResetPassword />);

    const campoEmail = screen.getByRole("textbox");
    fireEvent.change(campoEmail, {
      target: { value: "marcelo@email.com" },
    });

    const botaoEnviar = screen.getByRole("button", { name: /enviar email/i });
    fireEvent.click(botaoEnviar);

    expect(
      await screen.findByText("E-mail enviado com sucesso")
    ).toBeInTheDocument();
  });
});
