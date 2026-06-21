export interface TestUser {
  email: string;
  password: string;
}

export const VALID_PASSWORD = "Senha@123";

export function makeUser(overrides: Partial<TestUser> = {}): TestUser {
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    email: `e2e_${unique}@example.com`,
    password: VALID_PASSWORD,
    ...overrides,
  };
}
