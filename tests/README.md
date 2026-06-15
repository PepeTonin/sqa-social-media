# SQA Social Media - Testes Playwright

Projeto independente da Atividade 5 para futuros testes de API e End-to-End
(E2E). Nesta etapa existe apenas um smoke test temporário de infraestrutura.

## Pré-requisitos

- Node.js 18 ou superior;
- npm;
- Chromium do Playwright;
- API disponível em `http://localhost:8080`;
- frontend disponível em `http://localhost:3000`;
- MySQL e banco E2E preparados conforme `../ACTIVITY5_SETUP.md`.

## Instalação

```bash
cd tests
npm install
npx playwright install chromium
cp .env.example .env
```

O projeto é independente de `api/` e `client/`: suas dependências ficam em
`tests/package.json`.

## Variáveis de ambiente

```env
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8080
```

O arquivo `.env` é local e ignorado pelo Git. A configuração usa os valores
acima como fallback quando as variáveis não são definidas.

## Iniciar os serviços

O Playwright não inicia os serviços automaticamente. Use dois terminais.

Terminal da API:

```bash
cd api
set -a
source .env.e2e
set +a
./mvnw spring-boot:run
```

Terminal do frontend:

```bash
cd client
npm run dev
```

## Executar

```bash
cd tests
npm test
```

Scripts disponíveis:

```bash
npm run test:api
npm run test:e2e
npm run test:headed
npm run test:ui
npm run report
```

O smoke test temporário está em:

```text
specs/e2e/smoke.temporary.spec.ts
```

Ele valida somente que `/` responde e que a página é renderizada. Não substitui
os dois fluxos E2E nem os quatro testes de API exigidos na entrega.

## Relatórios e evidências

- relatório HTML: `playwright-report/`;
- resultados, screenshots, vídeos e traces: `test-results/`;
- screenshots: somente em falhas;
- vídeos: retidos somente em falhas;
- traces: retidos somente em falhas.

Abra o último relatório HTML com:

```bash
npm run report
```

## Primeira validação

Com a API em `8080` e o frontend em `3000`, foi executado:

```bash
npm test
```

Resultado:

```text
Running 1 test using 1 worker
1 passed (18.8s)
```

O relatório HTML foi gerado em `playwright-report/index.html`.
