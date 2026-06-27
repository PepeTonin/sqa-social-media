# Passos para entregar a Atividade 6

A atividade pede que o Pull Request seja aberto para a branch `main` e que a pipeline do GitHub Actions fique verde.

## 1. Atualizar a main com CI e testes consolidados

No seu fork/repositório:

```bash
git checkout main
git pull origin main
```

Copie os arquivos deste projeto para o seu repositório.

Depois, faça o commit da parte de CI/testes:

```bash
git add .github/workflows/ci.yml .gitignore api/mvnw api/src/main/java/com/demoapp/demo/service/UserService.java client/src/utils/password.ts client/src/lib/localStorage.ts
git commit -m "chore: configura CI e consolida testes"
git push origin main
```

## 2. Criar a branch da feature

```bash
git checkout -b feature/likes-dislikes
```

Confirme que os arquivos da feature estão alterados/adicionados:

```bash
git add api/src/main/java/com/demoapp/demo/service/PostService.java client/src/service/types/index.ts client/src/components/PostCard.tsx client/src/components/PostCard.test.tsx client/src/app/home.test.tsx docs/TESTES.md
git commit -m "feat: exibe likes e dislikes dos posts"
git push origin feature/likes-dislikes
```

## 3. Abrir o PR

No GitHub, abra um Pull Request de:

```text
feature/likes-dislikes -> main
```

A entrega deve ser o link do repositório com o PR aberto e a Action com status verde.
