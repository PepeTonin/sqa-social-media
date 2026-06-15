# SQA Social Media - Testes Playwright

Projeto independente da Atividade 5 para testes de API e End-to-End (E2E) com
Playwright.

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

## Helpers

Os utilitários reutilizáveis ficam em `helpers/`:

- `environment.ts`: resolve `API_URL` e `FRONTEND_URL`;
- `test-data.ts`: gera e-mails únicos e fornece senhas fortes;
- `auth-api.ts`: cria usuários e realiza login com `APIRequestContext`.

Cada teste cria seus próprios dados e não depende da ordem de execução, mocks ou
acesso direto ao banco.

## Testes de API

Arquivo:

```text
specs/api/auth.api.spec.ts
```

Cenários:

1. cadastro com dados válidos;
2. login com credenciais válidas;
3. cadastro com e-mail duplicado;
4. redefinição de senha para usuário inexistente;
5. login com senha forte incorreta.

Execução:

```bash
npx playwright test specs/api/auth.api.spec.ts
npm run test:api
```

Resultado validado:

```text
5 testes executados
4 aprovados
1 reprovado por bug funcional conhecido
```

O teste de duplicidade recebe HTTP 409 corretamente, mas a API retorna
`E-mail já está em uso`. O requisito exige `E-mail já cadastrado`; a expectativa
não foi ajustada para esconder a divergência.

## E2E de usuário deslogado

Arquivo:

```text
specs/e2e/unauthenticated-like.e2e.spec.ts
```

O cenário abre um contexto isolado, limpa cookies, `localStorage` e
`sessionStorage`, carrega o feed, tenta curtir o primeiro post e valida o alerta:

```text
Você precisa estar autenticado para curtir posts!
```

Também confirma que o usuário continua deslogado, o botão permanece como
`Curtir`, a URL não muda e a página continua funcional.

Execução:

```bash
npx playwright test specs/e2e/unauthenticated-like.e2e.spec.ts
npx playwright test specs/e2e/unauthenticated-like.e2e.spec.ts --headed
npm run test:e2e
```

Resultados validados:

- headless: 1 aprovado;
- headed: 1 aprovado;
- suíte E2E com smoke temporário: 2 aprovados.

Foram usados papéis semânticos (`banner`, `heading`, `listitem` e `button`). O
botão de curtida inclui um emoji no nome acessível, então o teste usa `/Curtir/`
dentro do primeiro card. Não foi necessário alterar o frontend.

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

## Diagnóstico de execução

- Falha funcional conhecida: mensagem incorreta no cadastro duplicado.
- Falha de ambiente observada: o sandbox local bloqueou inicialmente conexões
  para `localhost` e o registro Mach do Chromium. Fora dessa restrição, API e
  navegador executaram normalmente.
- Falha de teste corrigida: a primeira versão consultava a quantidade de posts
  antes do carregamento assíncrono. Foi substituída por uma assertion com espera
  automática, sem `waitForTimeout`.
- Testes aprovados não geram screenshot, vídeo ou trace. Em falhas, esses
  artefatos são gravados automaticamente em `test-results/`.

## Resultado consolidado das Etapas 3 e 4

Execução completa:

```bash
npm test
```

```text
Running 7 tests using 1 worker
6 passed
1 failed
```

A única falha é a assertion contratual:

```text
Expected: "E-mail já cadastrado"
Received: "E-mail já está em uso"
```

O status 409 e o formato JSON foram validados antes da comparação da mensagem.
O relatório HTML consolidado está em `playwright-report/index.html` e o trace
da falha conhecida está em `test-results/`.
