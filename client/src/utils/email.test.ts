import { isEmailValid } from './email';

describe('isEmailValid', () => {
  it('valida e invalida e-mails corretamente', () => {
    expect(isEmailValid('a@b.com')).toBe(true);
    expect(isEmailValid('abc')).toBe(false);
    expect(isEmailValid('')).toBe(false);
    expect(isEmailValid('abc@')).toBe(false);
  });
});