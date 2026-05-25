import { isEmailValid } from "@/utils/email";

describe("isEmailValid", () => {
  it.each([
    ["naoeumemail", false],
    ["marcelo@", false],
    ["marcelo@email.com", true],
  ])(
    'emailDeUsuarioDeveSerValido — "%s" → %s',
    (email, esperado) => {
      const resultado = isEmailValid(email);
      expect(resultado).toBe(esperado);
    }
  );
});
