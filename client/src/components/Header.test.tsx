import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
    user: null,
    isLoading: false,
    login: jest.fn(),
  }),
}));

describe('Header', () => {
  beforeEach(() => mockPush.mockClear());

  it('renderiza botões de login e título navega para home', () => {
    render(<Header />);

    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();

    fireEvent.click(screen.getByText('SQA Social Media'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});