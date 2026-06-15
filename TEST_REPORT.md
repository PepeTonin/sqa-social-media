# Relatório de Testes de Backend — Atividade 4

## Estratégia utilizada

Foram implementados três testes automatizados para o backend Spring Boot:

- um teste unitário da política de senha;
- dois testes de contrato do controller de autenticação com MockMvc;
- dois cenários de regressão que devem passar;
- um cenário que deve falhar por um bug funcional documentado.

Os testes são independentes, não compartilham estado, não usam MySQL e não
realizam chamadas à internet.

## Ferramentas

- JUnit 5;
- Spring Boot Test;
- MockMvc;
- AssertJ;
- H2 disponível no escopo de teste.

As dependências necessárias já estavam presentes no `api/pom.xml`. A
configuração H2 já existia em
`api/src/test/resources/application.properties`, portanto esses arquivos não
precisaram ser alterados.

## Classes criadas

### `UserServiceTest`

Arquivo:

```text
api/src/test/java/com/demoapp/demo/service/UserServiceTest.java
```

Cenário:

- `deveAceitarSenhaForteComExatamenteOitoCaracteres`

Valida que `Aa1!aaaa` atende à política do backend. Como a validação é uma
função pura, o service é instanciado sem acesso ao repositório.

### `AuthControllerTest`

Arquivo:

```text
api/src/test/java/com/demoapp/demo/controller/AuthControllerTest.java
```

Cenários:

- `deveRetornarNaoAutorizadoQuandoSenhaEstiverIncorreta`
- `deveRetornarConflitoQuandoEmailJaEstiverCadastrado`

O primeiro cenário usa uma senha incorreta que ainda cumpre a complexidade. Ele
valida:

- HTTP 401;
- conteúdo JSON;
- mensagem `Credenciais inválidas`;
- campo `status` igual a 401;
- interações esperadas com `UserService`;
- ausência de chamada a `createUser`.

O segundo cenário valida:

- HTTP 409;
- conteúdo JSON;
- campo `status` igual a 409;
- consulta do usuário existente;
- ausência de persistência;
- mensagem contratual `E-mail já cadastrado`.

O controller é criado com `MockMvcBuilders.standaloneSetup` e recebe um fake
controlado de `UserService`. Assim, os testes verificam chamadas relevantes e
ausência de persistência sem banco, internet, contexto completo do Spring ou
agente de instrumentação.

## Resultados

| ID | Teste | Resultado |
|---|---|---|
| BACK-TEST-001 | Senha forte com exatamente 8 caracteres | Aprovado |
| BACK-TEST-002 | Login com senha incorreta e complexa | Aprovado |
| BACK-TEST-003 | Cadastro com e-mail duplicado | Reprovado por bug funcional |

Resumo do Maven:

```text
Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
BUILD FAILURE
```

Execução isolada dos cenários de sucesso:

```bash
sh ./mvnw \
  -Dtest='UserServiceTest,AuthControllerTest#deveRetornarNaoAutorizadoQuandoSenhaEstiverIncorreta' \
  test
```

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Bug comprovado

Requisito:

```text
E-mail duplicado deve apresentar exatamente: E-mail já cadastrado
```

Comportamento atual:

```text
E-mail já está em uso
```

Assertion responsável:

```text
[mensagem retornada para tentativa de cadastro com e-mail duplicado]
expected: "E-mail já cadastrado"
 but was: "E-mail já está em uso"
```

Teste:

```text
AuthControllerTest.deveRetornarConflitoQuandoEmailJaEstiverCadastrado
```

Local da falha:

```text
AuthControllerTest.java:103
```

Essa é uma falha esperada da atividade. O status HTTP, a estrutura JSON e a
ausência de persistência foram validados antes da comparação da mensagem. Logo,
a reprovação não é causada por configuração, mock ou dependência externa.

## Comandos de execução

No workspace original:

```bash
cd api
./mvnw clean test
```

O wrapper não possui permissão de execução. A alternativa utilizada foi:

```bash
cd api
sh ./mvnw clean test
```

O caminho absoluto do workspace contém `Codes:Local Projects`. Como `:` é
separador do classpath Java em Unix, o compilador de testes não encontrou as
classes principais quando executado nesse caminho.

Para eliminar apenas essa falha ambiental, uma cópia temporária e inalterada de
`api` foi executada em caminho sem `:`:

```bash
cd /private/tmp/sqa-social-media-api-final.<sufixo>/api
sh ./mvnw clean test
```

Nesse ambiente, a suíte compilou e executou por completo, apresentando somente a
falha funcional planejada.

Uma versão inicial do teste de controller usava `@WebMvcTest`. O listener de
reset do Mockito tentou inicializar o mock maker inline, mas o Byte Buddy não
conseguiu anexar o agente de forma consistente ao JDK 23 deste ambiente. A
infraestrutura foi corrigida substituindo o carregamento do contexto por
`MockMvcBuilders.standaloneSetup` com um fake explícito de `UserService`. A
execução final teve zero erros de infraestrutura.

## Stack trace relevante

```text
org.opentest4j.AssertionFailedError:
[mensagem retornada para tentativa de cadastro com e-mail duplicado]
expected: "E-mail já cadastrado"
 but was: "E-mail já está em uso"
    at com.demoapp.demo.controller.AuthControllerTest
        .deveRetornarConflitoQuandoEmailJaEstiverCadastrado(
            AuthControllerTest.java:103)
```
