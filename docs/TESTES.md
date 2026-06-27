# Testes e CI — Atividade 6

Este projeto contém testes automatizados para o backend Spring Boot e para o frontend Next.js.

## Como rodar localmente

Backend:

```bash
cd api
chmod +x mvnw
./mvnw test
```

Frontend:

```bash
cd client
npm install
npm test
```

## Testes consolidados

### Backend — `api/`

- `UserServiceTest`: valida regras de senha forte e e-mail válido.
- `AuthControllerTest`: valida o contrato HTTP do endpoint `/auth/signin` para credenciais inválidas.

Correção aplicada: `UserService.isEmailValid` passou a validar e-mail com regex, rejeitando valores como `joao@` e `@dominio.com`.

### Frontend — `client/`

- `email.test.ts`: valida e-mails aceitos/rejeitados.
- `password.test.ts`: valida senha forte com mínimo de 8 caracteres.
- `PostCard.test.tsx`: valida renderização do post, likes/dislikes e comportamento do botão de curtir.
- `Header.test.tsx`: valida o menu para usuários logados e deslogados.
- `signin.test.tsx`: valida o fluxo de login.
- `home.test.tsx`: valida a renderização do feed e das reações vindas da API.

Correções aplicadas:

- `isPasswordValid` agora aceita senhas fortes com exatamente 8 caracteres.
- `saveUser` agora salva o usuário na mesma chave lida por `getUser`.

## Nova feature

A Home agora exibe, em cada post, o número de curtidas e descurtidas vindo do objeto `reactions` da API DummyJSON:

```json
{
  "reactions": {
    "likes": 10,
    "dislikes": 2
  }
}
```

O backend preserva essa estrutura no retorno de `/posts`, e o frontend renderiza os valores no componente `PostCard`.

## GitHub Actions

A esteira fica em `.github/workflows/ci.yml` e roda automaticamente em Pull Requests para a branch `main`.

Ela executa:

1. configuração de Java 17, Node.js 20 e MySQL;
2. instalação das dependências do frontend;
3. testes do backend com Maven;
4. testes do frontend com Jest;
5. build do frontend;
6. subida local da API e do cliente;
7. smoke tests para confirmar que ambos respondem.
