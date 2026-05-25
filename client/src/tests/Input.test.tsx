import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/components/Input";

describe("Input", () => {
  it("deve renderizar e exibir o texto digitado pelo usuário", () => {
    render(<Input label="Nome" type="text" />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "teste Marcelo" } });

    expect(input).toHaveValue("teste Marcelo");
  });

  it("deve exibir mensagem de erro quando prop error for fornecida", () => {
    render(<Input label="Email" type="text" error="Email inválido" />);
    expect(screen.getByText("Email inválido")).toBeInTheDocument();
  });
});
