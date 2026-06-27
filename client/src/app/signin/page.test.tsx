import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignIn from "@/app/signin/page";
import { authService } from "@/service/auth/auth";
import { useAuth } from "@/contexts/AuthContext";

const pushMock = jest.fn();
const loginMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: loginMock,
      logout: jest.fn(),
      user: null,
    });
  });

  it("deve fazer login e redirecionar para a pagina principal", async () => {
    // Teste de integracao: pagina, formulario, servico de auth, contexto e router.
    (authService.signIn as jest.Mock).mockResolvedValue({
      id: 1,
      email: "usuario@email.com",
    });

    const { container } = render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Senha@123" },
    });
    fireEvent.click(container.querySelector('button[type="submit"]')!);

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({
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
