# Atividade 4 — Prática de Testes 1

Testes automatizados criados para o projeto **SQA Social Media** (Spring Boot + Next.js),
com duas finalidades: **capturar bugs intencionais** (testes que falham) e **validar
requisitos corretos** (testes de regressão que passam).

## Como rodar

**Backend (JUnit):**
```bash
cd api
./mvnw test
```

**Frontend (Jest + Testing Library):**
```bash
cd client
npm install
npm test
```

> Observação: foram adicionados `client/jest.setup.ts` (matchers do `@testing-library/jest-dom`)
> e o `moduleNameMapper` do alias `@/` em `client/jest.config.ts` para o Jest resolver os imports.

---

## Backend — `api/` (4 testes: 3 passam, 1 falha)

Arquivos:
- `src/test/java/com/demoapp/demo/service/UserServiceTest.java`
- `src/test/java/com/demoapp/demo/controller/AuthControllerTest.java`

| Teste | Tipo | Requisito | Resultado |
|---|---|---|---|
| `isPasswordValid_senhaForte_retornaTrue` | unidade | Senha forte é aceita | ✅ passa |
| `isPasswordValid_senhaFraca_retornaFalse` | unidade | Senha fraca é rejeitada | ✅ passa |
| `signin_senhaIncorreta_retorna401` | integração (MockMvc) | Credenciais erradas → 401 "Credenciais inválidas" | ✅ passa |
| `isEmailValid_emailSemDominio_deveriaSerInvalido` | unidade | E-mail deve ser válido | ❌ **falha (bug)** |

### 🐞 Bug capturado (backend)
`UserService.isEmailValid` valida o e-mail apenas com `email.contains("@")`, aceitando
endereços inválidos como `joao@` (sem domínio) ou `@dominio.com` (sem usuário). O requisito
de cadastro exige **e-mail válido**. O teste afirma o comportamento correto e, por isso, falha.

**Correção sugerida:** usar um regex de e-mail, ex.:
`^[^\s@]+@[^\s@]+\.[^\s@]+$`.

---

## Frontend — `client/` (16 testes em 6 arquivos: 15 passam, 1 falha)

### 2 testes unitários — funções puras
- `src/utils/email.test.ts` — `isEmailValid` / `getEmailValidationMessage` ✅
- `src/utils/password.test.ts` — `isPasswordValid` ❌ **(bug)**

### 2 testes unitários — componentes isolados
- `src/components/PostCard.test.tsx` — alert para deslogado, `onLike` + feedback para logado ✅
- `src/components/Header.test.tsx` — botões corretos para logado/deslogado ✅

### 2 testes de integração — telas/fluxos
- `src/app/signin/signin.test.tsx` — fluxo de login (erro 401 e sucesso → `/`) ✅
- `src/app/home.test.tsx` — feed renderiza posts da API e alert ao curtir deslogado ✅

### 🐞 Bug capturado (frontend)
`utils/password.ts` usa a condição `password.length <= 8`, rejeitando senhas de **exatamente
8 caracteres**. O requisito é **mínimo de 8 caracteres**, logo `Senha@12` (8 chars, com
maiúscula, minúscula, número e especial) deveria ser válida. O teste afirma o esperado e falha.

**Correção sugerida:** trocar `<= 8` por `< 8` (em `isPasswordValid` e `getPasswordValidationMessage`).

---

## Outros bugs observados (não cobertos por teste, candidatos extras)

- **Mensagem de e-mail duplicado:** o backend retorna `"E-mail já está em uso"`, mas o
  requisito pede `"E-mail já cadastrado"` (`AuthController.signup`).
- **Chave do localStorage:** `lib/localStorage.ts` grava em `"user"` (`saveUser`) mas lê
  de `"sqa_social_user"` (`getUser`/`USER_KEY`), perdendo a sessão ao recarregar a página.
