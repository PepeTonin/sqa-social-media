import { isEmailValid, getEmailValidationMessage } from '@/utils/email';

describe('Validação de Email - Utilitários', () => {
  describe('isEmailValid', () => {
    it('✓ deve validar email correto', () => {
      console.log('Iniciando teste: validação de email correto');
      try {
        expect(isEmailValid('user@example.com')).toBe(true);
        console.log('✓ SUCESSO: Email correto validado');
      } catch (error) {
        console.error('✗ ERRO: Falha na validação de email correto', error);
        throw error;
      }
    });

    it('✓ deve validar email com múltiplos domínios', () => {
      console.log('Iniciando teste: validação de email com múltiplos domínios');
      try {
        expect(isEmailValid('user@mail.co.uk')).toBe(true);
        console.log('✓ SUCESSO: Email com múltiplos domínios validado');
      } catch (error) {
        console.error('✗ ERRO: Falha na validação de email com múltiplos domínios', error);
        throw error;
      }
    });

    it('✓ deve validar email com números', () => {
      console.log('Iniciando teste: validação de email com números');
      try {
        expect(isEmailValid('user123@example.com')).toBe(true);
        console.log('✓ SUCESSO: Email com números validado');
      } catch (error) {
        console.error('✗ ERRO: Falha na validação de email com números', error);
        throw error;
      }
    });

    it('✗ deve rejeitar email sem símbolo @', () => {
      console.log('Iniciando teste: rejeição de email sem @');
      try {
        expect(isEmailValid('userexample.com')).toBe(false);
        console.log('✓ SUCESSO: Email sem @ foi rejeitado');
      } catch (error) {
        console.error('✗ ERRO: Email sem @ não foi rejeitado corretamente', error);
        throw error;
      }
    });

    it('✗ deve rejeitar email sem extensão de domínio', () => {
      console.log('Iniciando teste: rejeição de email sem extensão de domínio');
      try {
        expect(isEmailValid('user@example')).toBe(false);
        console.log('✓ SUCESSO: Email sem extensão foi rejeitado');
      } catch (error) {
        console.error('✗ ERRO: Email sem extensão não foi rejeitado', error);
        throw error;
      }
    });

    it('✗ BUG: deve rejeitar email apenas com @ (sem domínio)', () => {
      console.log('Iniciando teste: verificação de BUG - email apenas com @');
      try {
        const result = isEmailValid('user@');
        // Frontend regex deveria capturar isso - backend não valida corretamente!
        expect(result).toBe(false);
        console.log('✓ SUCESSO: Email apenas com @ foi rejeitado (frontend correto)');
      } catch (error) {
        console.error('✗ ERRO: Problema na validação de email apenas com @', error);
        throw error;
      }
    });

    it('✗ deve rejeitar email nulo', () => {
      console.log('Iniciando teste: rejeição de email vazio');
      try {
        expect(isEmailValid('')).toBe(false);
        console.log('✓ SUCESSO: Email vazio foi rejeitado');
      } catch (error) {
        console.error('✗ ERRO: Email vazio não foi rejeitado', error);
        throw error;
      }
    });

    it('✗ deve rejeitar email com espaços', () => {
      console.log('Iniciando teste: rejeição de email com espaços');
      try {
        expect(isEmailValid('user @example.com')).toBe(false);
        console.log('✓ SUCESSO: Email com espaços foi rejeitado');
      } catch (error) {
        console.error('✗ ERRO: Email com espaços não foi rejeitado', error);
        throw error;
      }
    });

    it('✗ deve rejeitar email com espaços no domínio', () => {
      console.log('Iniciando teste: rejeição de email com espaços no domínio');
      try {
        expect(isEmailValid('user@exam ple.com')).toBe(false);
        console.log('✓ SUCESSO: Email com espaços no domínio foi rejeitado');
      } catch (error) {
        console.error('✗ ERRO: Email com espaços no domínio não foi rejeitado', error);
        throw error;
      }
    });

    it('✗ BUG: Inconsistência na validação de email com backend', () => {
      console.log('Iniciando teste: verificação de inconsistência frontend/backend');
      try {
        // Frontend valida corretamente, mas backend usa validação fraca
        // Backend apenas verifica símbolo "@"
        const emailWithoutDomain = 'user@';
        const result = isEmailValid(emailWithoutDomain);
        expect(result).toBe(false); // Frontend correto
        console.log('✓ SUCESSO: Frontend validou corretamente (backend aceitaria incorretamente)');
      } catch (error) {
        console.error('✗ ERRO: Problema na verificação de inconsistência', error);
        throw error;
      }
    });
  });

  describe('getEmailValidationMessage', () => {
    it('✓ deve retornar string vazia para email válido', () => {
      console.log('Iniciando teste: mensagem para email válido');
      try {
        expect(getEmailValidationMessage('user@example.com')).toBe('');
        console.log('✓ SUCESSO: String vazia retornada para email válido');
      } catch (error) {
        console.error('✗ ERRO: Mensagem incorreta para email válido', error);
        throw error;
      }
    });

    it('✓ deve retornar mensagem de obrigatoriedade para email vazio', () => {
      console.log('Iniciando teste: mensagem para email vazio');
      try {
        const message = getEmailValidationMessage('');
        expect(message).toContain('obrigatório');
        console.log('✓ SUCESSO: Mensagem de obrigatoriedade retornada');
      } catch (error) {
        console.error('✗ ERRO: Mensagem incorreta para email vazio', error);
        throw error;
      }
    });

    it('✓ deve retornar mensagem de invalidade para email inválido', () => {
      console.log('Iniciando teste: mensagem para email inválido');
      try {
        const message = getEmailValidationMessage('invalid-email');
        expect(message).toContain('inválido');
        console.log('✓ SUCESSO: Mensagem de invalidade retornada');
      } catch (error) {
        console.error('✗ ERRO: Mensagem incorreta para email inválido', error);
        throw error;
      }
    });

    it('✓ deve lidar com espaços removíveis', () => {
      console.log('Iniciando teste: remoção de espaços em email');
      try {
        expect(isEmailValid('  user@example.com  ')).toBe(true);
        console.log('✓ SUCESSO: Espaços removidos corretamente');
      } catch (error) {
        console.error('✗ ERRO: Problema ao remover espaços', error);
        throw error;
      }
    });
  });
});
