import { authService } from '@/service/auth/auth';
import api from '@/service/api';

jest.mock('@/service/api');

describe('Serviço de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login (signIn)', () => {
    it('✓ deve chamar endpoint de login com dados corretos', async () => {
      console.log('Iniciando teste: chamada ao endpoint de login');
      try {
        const mockResponse = {
          data: {
            id: 1,
            email: 'user@example.com',
            token: 'jwt-token'
          }
        };

        (api.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.signIn({
          email: 'user@example.com',
          password: 'SecurePass123!'
        });

        expect(api.post).toHaveBeenCalledWith('/auth/signin', {
          email: 'user@example.com',
          password: 'SecurePass123!'
        });
        expect(result).toEqual(mockResponse.data);
        console.log('✓ SUCESSO: Endpoint de login chamado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha na chamada ao endpoint de login', error);
        throw error;
      }
    });

    it('✓ deve tratar erro de login', async () => {
      console.log('Iniciando teste: tratamento de erro de login');
      try {
        const error = new Error('Credenciais inválidas');
        (api.post as jest.Mock).mockRejectedValue(error);

        await expect(
          authService.signIn({
            email: 'wrong@example.com',
            password: 'WrongPass123!'
          })
        ).rejects.toThrow('Credenciais inválidas');
        console.log('✓ SUCESSO: Erro de login tratado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no tratamento de erro de login', error);
        throw error;
      }
    });

    it('✓ deve retornar estrutura de resposta correta', async () => {
      console.log('Iniciando teste: verificação de estrutura de resposta');
      try {
        const mockResponse = {
          data: {
            id: 1,
            email: 'test@example.com',
            token: 'token123'
          }
        };

        (api.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.signIn({
          email: 'test@example.com',
          password: 'TestPass123!'
        });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('token');
        console.log('✓ SUCESSO: Estrutura de resposta está correta');
      } catch (error) {
        console.error('✗ ERRO: Estrutura de resposta incorreta', error);
        throw error;
      }
    });
  });

  describe('Cadastro (signUp)', () => {
    it('✓ deve chamar endpoint de cadastro com dados corretos', async () => {
      console.log('Iniciando teste: chamada ao endpoint de cadastro');
      try {
        const mockResponse = {
          data: {
            id: 1,
            email: 'newuser@example.com',
            token: 'jwt-token'
          }
        };

        (api.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.signUp({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        });

        expect(api.post).toHaveBeenCalledWith('/auth/signup', {
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        });
        expect(result).toEqual(mockResponse.data);
        console.log('✓ SUCESSO: Endpoint de cadastro chamado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha na chamada ao endpoint de cadastro', error);
        throw error;
      }
    });

    it('✓ deve tratar erro de cadastro (email já existe)', async () => {
      console.log('Iniciando teste: tratamento de erro de email duplicado');
      try {
        const error = new Error('Email já existe');
        (api.post as jest.Mock).mockRejectedValue(error);

        await expect(
          authService.signUp({
            email: 'existing@example.com',
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!'
          })
        ).rejects.toThrow('Email já existe');
        console.log('✓ SUCESSO: Erro de email duplicado tratado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no tratamento de erro de cadastro', error);
        throw error;
      }
    });

    it('✓ deve retornar estrutura de resposta correta', async () => {
      console.log('Iniciando teste: verificação de estrutura de resposta do cadastro');
      try {
        const mockResponse = {
          data: {
            id: 2,
            email: 'another@example.com',
            token: 'token456'
          }
        };

        (api.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.signUp({
          email: 'another@example.com',
          password: 'AnotherPass123!',
          confirmPassword: 'AnotherPass123!'
        });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('token');
        expect(result.id).toBe(2);
        console.log('✓ SUCESSO: Estrutura de resposta do cadastro está correta');
      } catch (error) {
        console.error('✗ ERRO: Estrutura de resposta do cadastro incorreta', error);
        throw error;
      }
    });
  });

  describe('Recuperação de Senha (resetPassword)', () => {
    it('✓ deve chamar endpoint de recuperação de senha', async () => {
      console.log('Iniciando teste: chamada ao endpoint de recuperação de senha');
      try {
        (api.post as jest.Mock).mockResolvedValue({ data: {} });

        await authService.resetPassword({
          email: 'user@example.com'
        });

        expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
          email: 'user@example.com'
        });
        console.log('✓ SUCESSO: Endpoint de recuperação de senha chamado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha na chamada ao endpoint de recuperação', error);
        throw error;
      }
    });

    it('✓ deve tratar erro de email não encontrado', async () => {
      console.log('Iniciando teste: tratamento de erro de email não encontrado');
      try {
        const error = new Error('Email não encontrado');
        (api.post as jest.Mock).mockRejectedValue(error);

        await expect(
          authService.resetPassword({
            email: 'nonexistent@example.com'
          })
        ).rejects.toThrow('Email não encontrado');
        console.log('✓ SUCESSO: Erro de email não encontrado tratado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no tratamento de erro de recuperação', error);
        throw error;
      }
    });

    it('✓ deve tratar erros de rede', async () => {
      console.log('Iniciando teste: tratamento de erro de rede');
      try {
        const error = new Error('Erro de rede');
        (api.post as jest.Mock).mockRejectedValue(error);

        await expect(
          authService.resetPassword({
            email: 'user@example.com'
          })
        ).rejects.toThrow('Erro de rede');
        console.log('✓ SUCESSO: Erro de rede tratado corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no tratamento de erro de rede', error);
        throw error;
      }
    });
  });

  describe('Cenários de Integração', () => {
    it('✓ deve lidar com fluxo completo de cadastro e login', async () => {
      console.log('Iniciando teste: fluxo completo de cadastro e login');
      try {
        const signUpResponse = {
          data: {
            id: 1,
            email: 'newuser@example.com',
            token: 'signup-token'
          }
        };

        const signInResponse = {
          data: {
            id: 1,
            email: 'newuser@example.com',
            token: 'signin-token'
          }
        };

        (api.post as jest.Mock)
          .mockResolvedValueOnce(signUpResponse)
          .mockResolvedValueOnce(signInResponse);

        const signUpResult = await authService.signUp({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        });

        const signInResult = await authService.signIn({
          email: 'newuser@example.com',
          password: 'SecurePass123!'
        });

        expect(signUpResult.id).toBe(signInResult.id);
        expect(signUpResult.email).toBe(signInResult.email);
        console.log('✓ SUCESSO: Fluxo completo de cadastro e login funcinou corretamente');
      } catch (error) {
        console.error('✗ ERRO: Falha no fluxo de cadastro e login', error);
        throw error;
      }
    });
  });
});
