# Atividade 5 - Etapa 1: preparação do ambiente

Esta etapa prepara a API e o frontend para os futuros testes E2E e de API.
Nenhum teste Playwright foi criado.

## Pré-requisitos validados

- Java 17 ou superior;
- Maven Wrapper;
- Node.js 18 ou superior;
- npm;
- MySQL;
- portas `8080` e `3000` disponíveis antes da inicialização.

## Banco MySQL exclusivo

Use um schema e um usuário exclusivos para E2E:

```sql
CREATE DATABASE IF NOT EXISTS sqa_social_media_e2e
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'sqa_e2e'@'localhost'
  IDENTIFIED BY '<senha-local>';
CREATE USER IF NOT EXISTS 'sqa_e2e'@'127.0.0.1'
  IDENTIFIED BY '<senha-local>';

GRANT ALL PRIVILEGES ON sqa_social_media_e2e.*
  TO 'sqa_e2e'@'localhost';
GRANT ALL PRIVILEGES ON sqa_social_media_e2e.*
  TO 'sqa_e2e'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Copie o exemplo local:

```bash
cd api
cp .env.e2e.example .env.e2e
```

Preencha `SPRING_DATASOURCE_PASSWORD` somente em `.env.e2e`. Esse arquivo é
ignorado pelo Git.

## Iniciar a API

```bash
cd api
set -a
source .env.e2e
set +a
./mvnw spring-boot:run
```

A API deve responder em `http://localhost:8080`.

Validação:

```bash
curl "http://localhost:8080/posts?limit=1&skip=0"
```

## Iniciar o frontend

Crie a configuração local:

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

O frontend deve abrir em `http://localhost:3000` e usar:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Verificações

```bash
curl -I http://localhost:3000
curl "http://localhost:8080/posts?limit=1&skip=0"
lsof -nP -iTCP:3000 -sTCP:LISTEN
lsof -nP -iTCP:8080 -sTCP:LISTEN
lsof -nP -iTCP:3306 -sTCP:LISTEN
```

## Observações

- Os testes Jest/JUnit da Atividade 4 permanecem intactos.
- Não foram corrigidos bugs funcionais documentados.
- A API consulta a DummyJSON ao executar `GET /posts`; essa validação depende de
  acesso à internet.
- O projeto `/tests` e os testes Playwright serão criados em uma etapa futura.

## Resultado da validação em 15/06/2026

| Item | Resultado |
|---|---|
| Java | OpenJDK 23.0.1, compatível com o requisito Java 17+ |
| Maven Wrapper | Maven 3.9.9; permissão de execução habilitada |
| Node.js | 22.14.0, compatível com o requisito Node.js 18+ |
| npm | 10.9.2 |
| MySQL | Homebrew MySQL 9.6.0 ativo em `3306` |
| Banco E2E | `sqa_social_media_e2e` criado com usuário dedicado |
| Backend | iniciou em `8080` e conectou ao banco sem erro |
| `GET /posts?limit=1&skip=0` | HTTP 200 com post retornado |
| Frontend | iniciou em `3000` usando `.env.local` |
| Página inicial | carregou o feed com 10 posts |
| Integração frontend/API | confirmada no navegador |
| Console/overlay do Next.js | nenhum erro encontrado |
| Conflitos de porta | nenhum conflito durante a inicialização |

### Bloqueio encontrado e resolução

Havia uma instalação MySQL 9.0.1 para arquitetura `x86_64` em `/usr/local`.
Neste Mac Apple Silicon ela encerrava com `SIGSEGV` ao inicializar uma instância
isolada. Foi instalada a versão nativa arm64 pelo Homebrew e o serviço passou a
iniciar normalmente.

O serviço global antigo também não podia escrever em `/usr/local/mysql/data`
sem privilégios do usuário `_mysql`; suas permissões e seus dados não foram
alterados.
