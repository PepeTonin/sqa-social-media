# SQA Social Media E2E

test update

Testes Playwright para validar fluxos de interface e endpoints da API.

## Visão Geral

- `tests/e2e/`: fluxos que acessam o frontend.
- `tests/api/`: testes diretos contra endpoints da API.
- `playwright.config.ts`: configuração dos navegadores e execução.

Os testes esperam:

- Frontend em `http://localhost:3000`
- API em `http://localhost:8080`

## Como Rodar

Pré-requisitos:

- Node.js 18+
- API rodando
- Frontend rodando

Instale as dependências:

```bash
npm install
npx playwright install
```

Execute todos os testes:

```bash
npm test
```

Execute apenas os fluxos de interface:

```bash
npm run test:e2e
```

Execute apenas os testes de API:

```bash
npm run test:api
```

Modo UI:

```bash
npx playwright test --ui
```

Modo com navegador visível:

```bash
npx playwright test --headed
```

## Estrutura

```text
e2e/
├── tests/api/
├── tests/e2e/
├── package.json
└── playwright.config.ts
```

## Referência

- [Playwright](https://playwright.dev/docs/intro)
