import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignIn from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";
import { useRouter } from "next/navigation";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/Header", () => {
  return function HeaderMock() {
    return <header>SQA Social Media</header>;
  };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;
const mockedSignIn = authService.signIn as jest.Mock;

describe("SignIn page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push: pushMock });
  });

  test("faz login com credenciais validas e redireciona para a home", async () => {
    // Teste de integracao de fluxo: preenche formulario, chama o servico,
    // atualiza o contexto de auth via login e navega para a rota principal.
    const loginMock = jest.fn();
    mockedUseAuth.mockReturnValue({ login: loginMock });
    mockedSignIn.mockResolvedValue({
      id: 1,
      email: "usuario@email.com",
    });

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Senha@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: "usuario@email.com",
        password: "Senha@123",
      });
    });

    expect(loginMock).toHaveBeenCalledWith({
      id: 1,
      email: "usuario@email.com",
    });
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
