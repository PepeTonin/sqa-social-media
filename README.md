# SQA Social Media

Projeto educacional: API Spring Boot + Frontend Next.js + Testes Playwright

## Estrutura

- **api/**: Backend Java 17 com Spring Boot (autenticação, usuários, posts, curtidas)
- **client/**: Frontend Next.js/React
- **tests/**: 6 testes automatizados (2 E2E + 4 API) com Playwright

## Rodar Aplicação

### API
```bash
cd api
./mvnw spring-boot:run
```

### Frontend
```bash
cd client
npm install
npm run dev
```

URLs:
- Frontend: http://localhost:3000
- API: http://localhost:8080

### Testes
```bash
cd tests
npm install
npm test                    # Todos os testes
npm run test:e2e          # Apenas E2E (2 testes)
npm run test:api          # Apenas API (4 testes)
```

## Documentação

- [Testes Detalhados](tests/README.md)
- [API](api/README.md)
- [Frontend](client/README.md)
