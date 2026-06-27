# Testes E2E e API

Este projeto usa Playwright para executar 2 testes E2E e 4 testes de API.

## Como instalar

```bash
cd tests
npm install
npx playwright install
```

## Como preparar o ambiente

Em um terminal, suba a API:

```bash
cd api
.\mvnw.cmd spring-boot:run
```

Em outro terminal, suba o frontend:

```bash
cd client
npm run dev
```

## Como executar os testes

Todos os testes:

```bash
cd tests
npm test
```

Apenas E2E:

```bash
npm run test:e2e
```

Apenas API:

```bash
npm run test:api
```

Abrir relatorio:

```bash
npm run report
```

## Cenarios automatizados

E2E:

- Cadastro de usuario com sucesso pela tela.
- Validacao de erro quando as senhas do cadastro sao diferentes.

API:

- Cadastro de usuario com dados validos.
- Cadastro recusado com email invalido.
- Login recusado com credenciais invalidas.
- Busca de posts.
