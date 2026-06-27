import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './page';
import { authService } from '@/service/auth/auth';
import { AxiosError } from 'axios';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    isLoading: false,
  }),
}));

jest.mock('@/service/auth/auth', () => ({
  authService: { signIn: jest.fn(), signUp: jest.fn() },
}));

describe('SignIn page', () => {
  it('exibe mensagem de erro ao falhar login', async () => {
    const error = new AxiosError('');
    (error as any).response = { data: { message: 'Credenciais inválidas' } };
    (authService.signIn as jest.Mock).mockRejectedValue(error);

    const { container } = render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'test@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'qualquer' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]')!);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
});