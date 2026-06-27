import '@testing-library/jest-dom'; // <--- Isso ensina o Jest a ler o DOM
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mockamos os hooks do Next.js e o Contexto para isolar o componente
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Testes Unitários (Componentes - Jest + Testing Library)', () => {
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('Teste 3 (Sucesso): Header deve exibir "Entrar" e "Criar Conta" para usuários deslogados', () => {
    // Simulamos um usuário não autenticado
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, logout: jest.fn() });
    
    render(<Header />);
    
    // Validamos se os botões corretos estão na tela
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('Teste 4 (Sucesso): Header deve exibir "Posts Curtidos" e "Sair" para usuários logados', () => {
    // Simulamos um usuário autenticado
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
    
    render(<Header />);
    
    // Validamos se a navegação muda corretamente conforme o requisito
    expect(screen.getByText('Posts Curtidos')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

});