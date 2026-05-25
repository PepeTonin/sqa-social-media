import { isPasswordValid } from "@/utils/password";

describe("isPasswordValid", () => {
  it.each([
    ["Senha@123", true, "válida — 9 chars com todos os requisitos"],
    ["Sa@1", false, "inválida — menos de 8 chars"],
    ["senha@123", false, "inválida — sem letra maiúscula"],
    ["SENHA@123", false, "inválida — sem letra minúscula"],
    ["Senha@abc", false, "inválida — sem número"],
    ["Senha1234", false, "inválida — sem caractere especial"],
    ["Senha@12", true, "BUG — exatamente 8 chars deveria ser válida (mínimo = 8)"],
  ])(
    'A senha deve conter 8 caracteres, no mínimo 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial — "%s" → %s (%s)',
    (senha, esperado) => {
      const resultado = isPasswordValid(senha);
      expect(resultado).toBe(esperado);
    }
  );
});
