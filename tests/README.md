# 📖 Testes Automatizados - SQA Social Media

## 🚀 Quick Start

```bash
cd tests
npm install  # Primeira vez
npm test     # Rodar tudo
```

---

## 📊 Sumário dos Testes

| # | Tipo | Arquivo | Nome | O que faz |
|---|------|---------|------|-----------|
| 1 | E2E | signup.spec.ts | Cadastro | Navega para /signup, preenche formulário e submete |
| 2 | E2E | login.spec.ts | Login | Navega para /signin, preenche email/senha e submete |
| 3 | API | auth.spec.ts | Login API | Testa POST /auth/signin com sucesso (status 200) |
| 4 | API | auth.spec.ts | Login Erro | Testa POST /auth/signin com senha errada (status 4xx) |
| 5 | API | auth.spec.ts | Signup API | Testa POST /auth/signup com email novo (status 200/201) |
| 6 | API | auth.spec.ts | Signup Duplicado | Testa POST /auth/signup com email duplicado (status 4xx) |

---

## 🧪 Testes E2E (End-to-End)

### Teste 1: Cadastro (signup.spec.ts)

```typescript
test('E2E 1: Pode preencher e submeter formulário de cadastro', async ({ page }) => {
```
- Começa um novo teste automatizado usando Playwright
- `page` = objeto que controla o navegador

```typescript
  await page.goto('/signup');
```
- **O que faz**: Navega para a página de cadastro
- **Como**: Abre a URL `http://localhost:3000/signup`
- **Aguarda**: Até a página carregar completamente

```typescript
  await page.fill('input[type="email"]', `user_${Date.now()}@test.com`);
```
- **O que faz**: Preenche o campo de email
- **Seletor**: `input[type="email"]` = qualquer input do tipo email na página
- **Valor**: Email único usando timestamp atual (ex: `user_1718891234567@test.com`)
- **Tempo**: Espera até encontrar o elemento

```typescript
  await page.fill('input[type="password"]', 'Password123!');
```
- **O que faz**: Preenche o campo de senha
- **Seletor**: `input[type="password"]` = qualquer input do tipo password
- **Valor**: Senha fixa (`Password123!`)

```typescript
  await page.click('button[type="submit"]');
```
- **O que faz**: Clica no botão de envio do formulário
- **Seletor**: `button[type="submit"]` = qualquer botão de tipo submit
- **Resultado**: Formulário é enviado para o servidor

```typescript
  await page.waitForTimeout(1000);
```
- **O que faz**: Aguarda 1 segundo
- **Motivo**: Dar tempo para o servidor processar a requisição

---

### Teste 2: Login (login-like.spec.ts)

```typescript
test('E2E 2: Pode fazer login com credenciais válidas', async ({ page }) => {
```
- Começa um novo teste de login
- Mesmo padrão do teste anterior

```typescript
  await page.goto('/signin');
```
- Navega para página de login: `http://localhost:3000/signin`

```typescript
  await page.fill('input[type="email"]', 'test@example.com');
```
- Preenche o email com: `test@example.com`
- Este email **deve existir** no banco de dados

```typescript
  await page.fill('input[type="password"]', 'password123');
```
- Preenche a senha com: `password123`
- **Importante**: A senha deve corresponder ao email acima

```typescript
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
```
- Clica para enviar o formulário
- Aguarda 1 segundo para o servidor responder

---

## 🔌 Testes de API (Caixa Preta)

### Setup Comum

```typescript
const API = 'http://localhost:8080/api';
```
- **O que é**: URL base da API
- **Onde é**: Servidor rodando na porta 8080
- **Usado em**: Todos os 4 testes de API

---

### Teste 3: Login Bem-Sucedido (auth.spec.ts)

```typescript
test('API 1: POST /auth/signin com credenciais válidas', async ({ request }) => {
```
- Nome do teste
- `request` = objeto que faz requisições HTTP

```typescript
  const response = await request.post(`${API}/auth/signin`, {
```
- **O que faz**: Faz uma requisição POST para `http://localhost:8080/api/auth/signin`
- **Método**: POST (enviar dados)
- **Aguarda**: Resposta do servidor

```typescript
    data: {
      email: 'test@example.com',
      password: 'password123',
    },
```
- **Corpo da requisição**: Dados enviados ao servidor
- **Email**: Deve existir no banco
- **Senha**: Deve estar correta para este email

```typescript
  expect(response.status()).toBe(200);
```
- **Validação**: O servidor deve responder com status 200 (OK)
- **Falha se**: Status for diferente de 200

```typescript
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
});
```
- **O que faz**: Lê a resposta JSON do servidor
- **Validações**:
  - Resposta deve ter propriedade `id`
  - Resposta deve ter propriedade `email`

**Exemplo de resposta esperada:**
```json
{
  "id": 1,
  "email": "test@example.com"
}
```

---

### Teste 4: Login com Erro (auth.spec.ts)

```typescript
test('API 2: POST /auth/signin com senha inválida', async ({ request }) => {
  const response = await request.post(`${API}/auth/signin`, {
    data: {
      email: 'test@example.com',
      password: 'wrongpassword',  // ❌ Senha errada
    },
  });
```
- **Diferença**: Usa senha incorreta (`wrongpassword` em vez de `password123`)
- **Objetivo**: Testar se a API rejeita credenciais inválidas

```typescript
  expect([400, 401, 404]).toContain(response.status());
});
```
- **Validação**: Status deve ser 400, 401 ou 404
  - **400**: Bad Request (dados inválidos)
  - **401**: Unauthorized (credenciais incorretas)
  - **404**: Not Found (usuário não existe)

---

### Teste 5: Cadastro Bem-Sucedido (auth.spec.ts)

```typescript
test('API 3: POST /auth/signup com email novo', async ({ request }) => {
  const response = await request.post(`${API}/auth/signup`, {
    data: {
      email: `newuser_${Date.now()}@test.com`,  // Email único!
      password: 'Password123!',
    },
  });
```
- **Diferença**: POST para `/auth/signup` (cadastro, não login)
- **Email**: Usar timestamp para garantir unicidade
  - Exemplo: `newuser_1718891234567@test.com`
  - Cada teste gera um email diferente

```typescript
  expect([200, 201]).toContain(response.status());
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
});
```
- **Validação**: Status deve ser 200 ou 201
  - **200**: OK (sucesso)
  - **201**: Created (novo recurso criado)
- **Resposta**: Deve ter `id` e `email` do novo usuário

**Exemplo de resposta esperada:**
```json
{
  "id": 123,
  "email": "newuser_1718891234567@test.com"
}
```

---

### Teste 6: Cadastro Duplicado (auth.spec.ts)

```typescript
test('API 4: POST /auth/signup com email duplicado', async ({ request }) => {
  const response = await request.post(`${API}/auth/signup`, {
    data: {
      email: 'test@example.com',  // Email que já existe!
      password: 'Password123!',
    },
  });
```
- **Objetivo**: Testar rejeição de email duplicado
- **Email**: Usar um que já existe no banco (`test@example.com`)

```typescript
  expect([400, 409]).toContain(response.status());
});
```
- **Validação**: Status deve ser 400 ou 409
  - **400**: Bad Request (email inválido/duplicado)
  - **409**: Conflict (recurso já existe)

---

## 🔧 Como Rodar

### Tudo

```bash
npm test
```

**Saída esperada:**
```
✓ API 1: POST /auth/signin com credenciais válidas (0.8s)
✓ API 2: POST /auth/signin com senha inválida (0.7s)
✓ API 3: POST /auth/signup com email novo (0.9s)
✓ API 4: POST /auth/signup com email duplicado (0.7s)
✓ E2E 1: Pode preencher e submeter formulário de cadastro (2.5s)
✓ E2E 2: Pode fazer login com credenciais válidas (2.3s)

6 passed (7.9s)
```

### Apenas testes E2E

```bash
npm run test:e2e
```

### Apenas testes de API

```bash
npm run test:api
```

### Interface Visual

```bash
npm run test:ui
```

---

## 📋 Dados de Teste

### Usuário Pré-existente (para login)

```
Email: test@example.com
Senha: password123
```

**Criar no banco de dados:**
```sql
INSERT INTO users (email, password) VALUES ('test@example.com', 'password123');
```

### Novos Usuários (para signup)

Cada teste cria um email único automaticamente:
```
newuser_1718891234567@test.com
newuser_1718891234568@test.com
newuser_1718891234569@test.com
...
```

---

## ✅ Checklist de Verificação

Antes de rodar os testes:

- [ ] API está rodando em `http://localhost:8080`
  ```bash
  cd api && ./mvnw.cmd spring-boot:run
  ```

- [ ] Cliente está rodando em `http://localhost:3000`
  ```bash
  cd client && npm run dev
  ```

- [ ] Usuário de teste existe no banco:
  ```
  Email: test@example.com
  Senha: password123
  ```

- [ ] Dependências instaladas:
  ```bash
  npm install
  ```

---

## 🐛 Troubleshooting

### "Connection refused" para API

```
Erro: Failed to connect to localhost:8080
```

**Solução:**
```bash
cd api
./mvnw.cmd spring-boot:run
```

### "Page not found" para Cliente

```
Erro: Page did not load (timeout)
```

**Solução:**
```bash
cd client
npm run dev
```

### "Email test@example.com not found"

```
Erro: API 1: POST /auth/signin com credenciais válidas
Expected: 200
Received: 404
```

**Solução:** Criar usuário no banco ou alterar o email nos testes.

### Teste E2E clica mas nada acontece

```
Erro: Timeout waiting for button to be clicked
```

**Possível causa:** Seletor CSS está errado. Solução:

```bash
npm run codegen  # Gera seletores automaticamente
```

---

## 📚 Referências

- [Playwright Docs](https://playwright.dev)
- [API Testing Guide](https://playwright.dev/docs/api-testing)
- [E2E Testing Guide](https://playwright.dev/docs/writing-tests)

---

**Status**: ✅ Pronto para usar  
**Última atualização**: 2026-06-20  
**Total de testes**: 6 (2 E2E + 4 API)

