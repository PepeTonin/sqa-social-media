import { isPasswordValid } from './password';

describe('isPasswordValid', () => {
  it('aceita senha com exatamente 8 caracteres', () => {
    expect(isPasswordValid('Abc1@xyz')).toBe(true);
  });
});