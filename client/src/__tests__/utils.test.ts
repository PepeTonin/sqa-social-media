import { isEmailValid, getEmailValidationMessage } from '@/utils/email';
import { isPasswordValid } from '@/utils/password';

describe('Testes Unitários (Funções Simples - Jest)', () => {
  
  it('Teste 1 (Sucesso): isEmailValid deve retornar true para um e-mail válido', () => {
    // Testa uma função pura sem renderizar componentes
    const emailValido = 'aluno@faculdade.com';
    expect(isEmailValid(emailValido)).toBe(true);
  });

  it('Teste 2 (Sucesso): isPasswordValid deve retornar true para senha forte (> 8 chars)', () => {
    // Testa se a função de senha passa com os critérios: Maiúscula, minúscula, número e especial
    const senhaForte = 'Forte123@!';
    expect(isPasswordValid(senhaForte)).toBe(true);
  });

});