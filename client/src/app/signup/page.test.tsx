import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './page';
import { authService } from '@/service/auth/auth';

const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
    logout: jest.fn(),
    user: null,
    isLoading: false,
  }),
}));

jest.mock('@/service/auth/auth', () => ({
  authService: { signIn: jest.fn(), signUp: jest.fn() },
}));

describe('SignUp page', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogin.mockClear();
  });

  it('redireciona para home após cadastro bem-sucedido', async () => {
    (authService.signUp as jest.Mock).mockResolvedValue({ id: 1, email: 'test@email.com' });

    const { container } = render(<SignUp />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'test@email.com' },
    });
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'Senha@123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Senha@123' } });

    fireEvent.click(container.querySelector('button[type="submit"]')!);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});