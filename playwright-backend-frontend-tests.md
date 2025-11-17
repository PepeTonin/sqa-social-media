# ✅ Adição de Testes End-to-End e API com Playwright

Este commit inclui a implementação de testes automatizados utilizando **Playwright**, cobrindo fluxos essenciais das camadas **backend** e **frontend** do sistema.

---

## 🧪 Testes Backend (API) – `tests/backend/posts.spec.ts`

Foram criados testes para validar as principais operações relacionadas a autenticação e posts.

### ✔ Autenticação Automática para Testes
Implementada função `loginAndGetUser()`:

- Realiza login com credenciais fixas.
- Caso o usuário não exista, faz o cadastro e tenta o login novamente.
- Retorna `userId` e `email` para uso nos demais testes.
- Garante consistência e independência dos testes.

### ✔ Testes Implementados

- **Acesso ao endpoint `/posts/liked` sem login**  
  Verifica se a API responde com um status esperado (200, 401 ou 403).

- **Retorno dos posts curtidos com usuário autenticado**  
  Verifica se o endpoint retorna corretamente **status 200**.

- **Curtir ou descurtir um post (`toggleLike`)**  
  Envia requisição para `/posts/:id/like` e espera **status 200**.

- **Reset de senha para usuário inexistente**  
  Envia requisição para `/auth/reset-password`, espera **404** e valida mensagem `"Usuário não encontrado"`.

---

## 🧪 Testes Frontend

### 📁 `tests/frontend/login.spec.ts`
Testa o fluxo de login no frontend:

- Acessa `/signin`
- Preenche email e senha
- Envia o formulário
- Valida redirecionamento para `/`

### 📁 `tests/frontend/signup.spec.ts`
Testa o fluxo de cadastro:

- Acessa `/signup`
- Preenche email, senha e confirmação de senha
- Envia o formulário
- Valida redirecionamento para `/`

---

## 📌 Resumo do que foi adicionado

- Estrutura de testes para **backend** e **frontend**
- Função automática de login/cadastro para testes de API
- Testes de autenticação, likes e reset de senha na API
- Testes de login e signup no frontend
- Cobertura dos principais fluxos de autenticação e posts

