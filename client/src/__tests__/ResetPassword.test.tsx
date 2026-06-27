import '@testing-library/jest-dom'; // <--- Isso ensina o Jest a ler o DOM
import { render, screen, fireEvent } from '@testing-library/react';
import ResetPassword from '@/app/reset-password/page';
import { authService } from '@/service/auth/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // <--- Importamos o useAuth

jest.mock('@/service/auth/auth');
jest.mock('@/contexts/AuthContext'); // <--- Mockamos o AuthContext
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Testes de Integração (Telas/Fluxos - Jest + Testing Library)', () => {
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false }); // <--- Definimos que não tem usuário logado
  });

  it('Teste 5 (Sucesso): Deve bloquear o fluxo e exibir erro se tentar enviar formulário vazio', async () => {
    render(<ResetPassword />);
    
    // Interação do usuário: Clica no botão sem preencher o e-mail
    const button = screen.getByRole('button', { name: /enviar email/i });
    fireEvent.click(button);
    
    // Valida se o componente de Input mostrou o erro corretamente
    expect(await screen.findByText('Email é obrigatório')).toBeInTheDocument();
  });

  it('Teste 6 (Teste de Bug): Deve exibir a mensagem exata ao redefinir senha com sucesso', async () => {
    // Simulamos o sucesso da API
    (authService.resetPassword as jest.Mock).mockResolvedValue({});
    
    render(<ResetPassword />);
    
    // Fluxo do usuário: Preenche e-mail e clica em enviar
    const input = screen.getByPlaceholderText('seu@email.com');
    const button = screen.getByRole('button', { name: /enviar email/i });
    
    fireEvent.change(input, { target: { value: 'teste@teste.com' } });
    fireEvent.click(button);
    
    // O TESTE VAI FALHAR AQUI (Bug intencional capturado)
    expect(await screen.findByText('E-mail enviado com sucesso')).toBeInTheDocument();
  });

});