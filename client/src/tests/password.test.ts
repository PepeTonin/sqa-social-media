import { isPasswordValid } from "../utils/password";

describe("isPasswordValid", () => {
  test("should return false for empty password", () => {
    expect(isPasswordValid("")).toBe(false);
  });
  
  test("should return false for password shorter than 8 characters", () => {
    expect(isPasswordValid("Ab1@")).toBe(false);
  });

  test("should return false for password without uppercase letter", () => {
    expect(isPasswordValid("ab1@abcd")).toBe(false);
  });

  test("should return false for password without lowercase letter", () => {
    expect(isPasswordValid("AB1@ABCD")).toBe(false);
  });

  test("should return false for password without number", () => {
    expect(isPasswordValid("Abc@defg")).toBe(false);
  });

  test("should return false for password without special character", () => {
    expect(isPasswordValid("Abc1defg")).toBe(false);
  });

  test("should return true for valid password 8 characters", () => {
    expect(isPasswordValid("Abc1@defg")).toBe(true);
  });

  test("should return true for valid password 9 characters", () => {
    expect(isPasswordValid("Abc1@defg")).toBe(true);
  });

});

