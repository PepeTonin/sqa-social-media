# SQA Social Media — Testes com Playwright

## Pré‑requisitos

- Node 18+

## Instalação (primeira vez)

```bash
cd tests
npm install
npx playwright install
```

## Estrutura dos testes

```
tests/
└─ tests/
   ├─ e2e/
   │  ├─ intro.spec.ts              # smoke da home
   │  ├─ signup.spec.ts             # fluxo de criar conta
   └─ api/
      ├─ posts.spec.ts              # GET /posts
      └─ auth.spec.ts               # POST /auth/signup
```

> Smoke test: https://www.techtarget.com/searchsoftwarequality/definition/smoke-testing

## Assumptions/URLs

- Frontend: http://localhost:3000
- API: http://localhost:8080

## Como executar

```bash
# Executar todos os testes
npx playwright test

# Rodar apenas testes E2E
npx playwright test e2e

# Rodar apenas testes de API
npx playwright test api

# Rodar um arquivo ou teste específico (exemplo)
npx playwright test e2e/signup.spec.ts

# Rodar testes em modo interativo/UI
npx playwright test --ui

# Rodar testes com visualização do navegador
npx playwright test --headed

# Executar em modo debug (pausa no breakpoint)
npx playwright test --debug
```
Veja mais opções e explicações em: https://playwright.dev/docs/running-tests

---

**Documentação completa:**

- Playwright: https://playwright.dev/docs/intro
