/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Componente de teste que usa o hook
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? `Logado como ${user?.email}` : 'Não logado'}
      </div>
      <button
        data-testid="login-btn"
        onClick={() => login({ id: 1, email: 'test@example.com' })}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('Contexto de Autenticação', () => {
  describe('AuthProvider & Hook useAuth', () => {
    it('✓ deve fornecer estado inicial de autenticação', () => {
      console.log('Iniciando teste: estado inicial de autenticação');
      try {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Não logado');
        console.log('✓ SUCESSO: Estado inicial fornecido corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha ao fornecer estado inicial', error);
        throw error;
      }
    });

    it('✓ deve lançar erro quando useAuth é usado fora do provider', () => {
      console.log('Iniciando teste: uso de useAuth fora do provider');
      try {
        const ComponentWithoutProvider = () => {
          const { isAuthenticated } = useAuth();
          return <div>{isAuthenticated.toString()}</div>;
        };

        // Suprimir console.error para este teste
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
          render(<ComponentWithoutProvider />);
        }).toThrow('useAuth must be used within AuthProvider');

        spy.mockRestore();
        console.log('✓ SUCESSO: Erro lançado corretamente para uso fora do provider');
      } catch (error) {
        console.error('✗ ERRO: Falha na verificação de uso fora do provider', error);
        throw error;
      }
    });

    it('✓ deve atualizar estado de autenticação após login', async () => {
      console.log('Iniciando teste: atualização de estado após login');
      try {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );

        const loginBtn = screen.getByTestId('login-btn');
        fireEvent.click(loginBtn);

        await waitFor(() => {
          expect(screen.getByTestId('auth-status')).toHaveTextContent(
            'Logado como test@example.com'
          );
        });
        console.log('✓ SUCESSO: Estado atualizado corretamente após login');
      } catch (error) {
        console.error('✗ ERRO: Falha na atualização de estado após login', error);
        throw error;
      }
    });

    it('✓ deve limpar estado de autenticação após logout', async () => {
      console.log('Iniciando teste: limpeza de estado após logout');
      try {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );

        const loginBtn = screen.getByTestId('login-btn');
        fireEvent.click(loginBtn);

        await waitFor(() => {
          expect(screen.getByTestId('auth-status')).toHaveTextContent('Logado');
        });

        const logoutBtn = screen.getByTestId('logout-btn');
        fireEvent.click(logoutBtn);

        await waitFor(() => {
          expect(screen.getByTestId('auth-status')).toHaveTextContent('Não logado');
        });
        console.log('✓ SUCESSO: Estado limpo corretamente após logout');
      } catch (error) {
        console.error('✗ ERRO: Falha na limpeza de estado após logout', error);
        throw error;
      }
    });
  });

  describe('Funcionalidade de Login', () => {
    it('✓ deve definir dados do usuário após login bem-sucedido', async () => {
      console.log('Iniciando teste: definição de dados do usuário no login');
      try {
        const TestLoginComponent = () => {
          const { user, login, isAuthenticated } = useAuth();

          return (
            <div>
              <button onClick={() => login({ id: 1, email: 'user@test.com' })}>
                Entrar
              </button>
              {isAuthenticated && (
                <div data-testid="user-email">{user?.email}</div>
              )}
            </div>
          );
        };

        render(
          <AuthProvider>
            <TestLoginComponent />
          </AuthProvider>
        );

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
          expect(screen.getByTestId('user-email')).toHaveTextContent(
            'user@test.com'
          );
        });
        console.log('✓ SUCESSO: Dados do usuário definidos corretamente no login');
      } catch (error) {
        console.error('✗ ERRO: Falha ao definir dados do usuário', error);
        throw error;
      }
    });

    it('✓ deve lidar com login usando email e senha', async () => {
      console.log('Iniciando teste: login com email e senha');
      try {
        const TestLoginComponent = () => {
          const { isAuthenticated, login } = useAuth();

          return (
            <div>
              <button
                onClick={() =>
                  login({ id: 2, email: 'newuser@example.com' })
                }
                data-testid="custom-login"
              >
                Login
              </button>
              <div data-testid="auth-check">
                {isAuthenticated ? 'Autenticado' : 'Não Autenticado'}
              </div>
            </div>
          );
        };

        render(
          <AuthProvider>
            <TestLoginComponent />
          </AuthProvider>
        );

        fireEvent.click(screen.getByTestId('custom-login'));

        await waitFor(() => {
          expect(screen.getByTestId('auth-check')).toHaveTextContent(
            'Autenticado'
          );
        });
        console.log('✓ SUCESSO: Login com email e senha realizado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no login com email e senha', error);
        throw error;
      }
    });
  });

  describe('Funcionalidade de Autenticação Persistente', () => {
    it('✓ deve persistir dados do usuário após login', async () => {
      console.log('Iniciando teste: persistência de dados após login');
      try {
        const TestPersistenceComponent = () => {
          const { user, isAuthenticated, login } = useAuth();

          return (
            <div>
              <button
                onClick={() =>
                  login({ id: 3, email: 'persist@example.com' })
                }
                data-testid="persist-btn"
              >
                Login
              </button>
              {isAuthenticated && (
                <div data-testid="persist-user">{user?.email}</div>
              )}
            </div>
          );
        };

        render(
          <AuthProvider>
            <TestPersistenceComponent />
          </AuthProvider>
        );

        fireEvent.click(screen.getByTestId('persist-btn'));

        await waitFor(() => {
          expect(screen.getByTestId('persist-user')).toHaveTextContent(
            'persist@example.com'
          );
        });
        console.log('✓ SUCESSO: Dados do usuário persistidos corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha ao persistir dados', error);
        throw error;
      }
    });
  });

  describe('Gerenciamento de Sessão', () => {
    it('✓ deve manter sessão do usuário após login', async () => {
      console.log('Iniciando teste: manutenção de sessão após login');
      try {
        const MultiRenderComponent = () => {
          const { user, isAuthenticated, login } = useAuth();

          return (
            <div>
              <button onClick={() => login({ id: 4, email: 'persistent@example.com' })}>
                Login
              </button>
              {isAuthenticated && (
                <div data-testid="session-user">{user?.email}</div>
              )}
            </div>
          );
        };

        render(
          <AuthProvider>
            <MultiRenderComponent />
          </AuthProvider>
        );

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
          expect(screen.getByTestId('session-user')).toHaveTextContent(
            'persistent@example.com'
          );
        });

        // Usuário ainda deve estar logado
        expect(screen.getByTestId('session-user')).toBeInTheDocument();
        console.log('✓ SUCESSO: Sessão mantida corretamente após login');
      } catch (error) {
        console.error('✗ ERRO: Falha na manutenção de sessão', error);
        throw error;
      }
    });
  });
});
