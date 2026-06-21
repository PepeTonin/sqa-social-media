# Testes E2E e de API

Projeto simples de testes da aplicação SQA Social Media usando Playwright.

## Instalação

Dentro da pasta `tests`, execute:

```bash
npm install
npx playwright install chromium
```

## Antes de executar

A API deve estar rodando em:

```text
http://localhost:8080
```

O frontend deve estar rodando em:

```text
http://localhost:3000
```

## Execução

Executar todos os testes:

```bash
npm test
```

Executar somente os 2 testes E2E:

```bash
npm run test:e2e
```

Executar somente os 4 testes de API:

```bash
npm run test:api
```

Abrir o relatório HTML:

```bash
npm run report
```

## Cenários testados

### E2E

1. Cadastro de um novo usuário.
2. Login com credenciais válidas.

### API

1. Cadastro com dados válidos.
2. Cadastro com e-mail duplicado.
3. Login com credenciais válidas.
4. Login com senha incorreta.
