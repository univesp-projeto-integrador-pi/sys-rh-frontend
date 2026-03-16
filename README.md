# Sistema de RH

[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** - Ambiente de execução JavaScript
  - Download: [https://nodejs.org/](https://nodejs.org/)
  - ⚠️ **Importante**: Versão LTS (Long Term Support) recomendada
  - Versão mínima necessária: 16.0.0 ou superior

- **npm** ou **yarn** - Gerenciadores de pacotes
  - npm (já vem com Node.js)
  - yarn: `npm install -g yarn`

- **Git** - Controle de versão
  - Download: [https://git-scm.com/](https://git-scm.com/)

## 🛠️ IDE Recomendada

Recomendamos o uso do **[Visual Studio Code](https://code.visualstudio.com/)** como editor de código, com as seguintes extensões ESSENCIAIS para React:

- **ES7+ React/Redux/React-Native snippets** - snippets de código para React
- **Prettier** - formatador de código automático
- **ESLint** - identificador de erros e padrões de código
- **Simple React Snippets** - atalhos para componentes React
- **GitLens** - visualização avançada do histórico Git
- **vscode-styled-components** - se usar styled-components

## 🚀 Como executar o projeto

### 1. Clonar o repositório

```bash
# Clone o repositório
git clone https://github.com/univesp-projeto-integrador-pi/sys-rh-frontend
```

### 2. Instalar as dependências

Com npm:
```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

### 3. Executar o projeto em desenvolvimento

Com npm:
```bash
npm start
```

Com yarn:
```bash
yarn start
```

O aplicativo abrirá automaticamente em `http://localhost:3000`

## 📚 Sobre o React

[React](https://reactjs.org/) é uma biblioteca JavaScript para construção de interfaces de usuário. Principais características:

- **Componentização** - Criação de componentes reutilizáveis
- **Virtual DOM** - Alta performance na atualização da interface
- **JSX** - Sintaxe que mistura HTML com JavaScript
- **Unidirecional** - Fluxo de dados previsível
- **Hooks** - Gerenciamento de estado e efeitos colaterais

### Estrutura típica de um projeto React

```
📦 meu-projeto-react
├── 📁 public/                 # Arquivos públicos (index.html, favicon)
├── 📁 src/                     # Código fonte
│   ├── 📁 components/          # Componentes reutilizáveis
│   ├── 📁 pages/               # Páginas/rotas da aplicação
│   ├── 📁 hooks/               # Custom hooks
│   ├── 📁 context/             # Context API
│   ├── 📁 services/            # Chamadas API
│   ├── 📁 utils/               # Funções utilitárias
│   ├── 📁 styles/              # Arquivos de estilo
│   ├── 📁 assets/              # Imagens, fonts, etc.
│   ├── App.js                  # Componente principal
│   ├── index.js                # Ponto de entrada
│   └── routes.js               # Configuração de rotas
├── package.json                # Dependências e scripts
└── README.md                   # Documentação
```

## 🔧 Configuração do Ambiente

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=https://api.exemplo.com
REACT_APP_API_KEY=sua-chave-api
PORT=3000
```

**Importante:** Variáveis React precisam começar com `REACT_APP_`

## 🌿 Trabalhando com branches

### Criar uma nova branch

```bash
# Criar e mudar para nova branch
git checkout -b nome-da-sua-branch

# Exemplos de nomes de branch:
# feature/nova-funcionalidade
# feature/adicionar-carrinho-compras
# bugfix/corrigir-botao-login
# hotfix/ajuste-urgente-producao
# refactor/melhorar-componente-card
```

### Fazer alterações e commit

```bash
# Verificar status das alterações
git status

# Adicionar arquivos específicos
git add src/components/NovoComponente.js

# Ou adicionar todos os arquivos
git add .

# Fazer commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade de busca"
```

### Subir alterações para o GitHub

```bash
# Primeiro push (para branch nova)
git push -u origin nome-da-sua-branch

# Próximos pushes (já configurado)
git push
```

### Criar Pull Request (PR)

1. Acesse o repositório no GitHub
2. Clique em "Pull requests" > "New pull request"
3. Selecione sua branch para merge na branch principal (main/master)
4. Preencha título e descrição do PR
5. Clique em "Create pull request"

### Padrões de commit (Conventional Commits)

- `feat:` - nova funcionalidade (ex: `feat: adicionar botão de login`)
- `fix:` - correção de bug (ex: `fix: corrigir erro na API`)
- `docs:` - documentação (ex: `docs: atualizar README`)
- `style:` - formatação de código (ex: `style: formatar código com prettier`)
- `refactor:` - refatoração (ex: `refactor: melhorar componente Header`)
- `test:` - adição/atualização de testes
- `chore:` - tarefas de build/ferramentas

### Comandos úteis do Git

```bash
# Atualizar branch local
git pull origin main

# Ver branches existentes
git branch -a

# Mudar para outra branch
git checkout nome-da-branch

# Deletar branch local (após merge)
git branch -d nome-da-branch

# Deletar branch remota
git push origin --delete nome-da-branch

# Ver histórico de commits
git log --oneline

# Criar stash (guardar alterações temporariamente)
git stash

# Recuperar stash
git stash pop
```

### Boas práticas React

1. **Componentes funcionais + Hooks** - Use sempre componentes funcionais
2. **Organização de imports**:
   ```javascript
   // 1. React e bibliotecas externas
   import React, { useState, useEffect } from 'react';
   // 2. Componentes próprios
   import Header from './components/Header';
   // 3. Estilos
   import './styles.css';
   ```

3. **Nomenclatura**:
   - Componentes: PascalCase (ex: `ButtonPrimary`)
   - Arquivos: PascalCase para componentes (ex: `Header.js`)
   - Funções: camelCase (ex: `handleClick`)
   - Constantes: UPPER_SNAKE_CASE (ex: `API_URL`)

4. **Testes** - Mantenha testes atualizados:
   ```bash
   npm test
   ```

### Troubleshooting comum

**Erro: "Module not found"**
```bash
# Solução: reinstalar dependências
rm -rf node_modules
rm package-lock.json
npm install
```

**Erro de porta em uso**
```bash
# Mude a porta no .env
PORT=3001
```

## 📦 Dependências comuns em projetos React

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",        // Rotas
    "axios": "^1.3.0",                    // Requisições HTTP
    "styled-components": "^5.3.6",        // Estilização
    "react-hook-form": "^7.43.0",         // Formulários
    "react-icons": "^4.7.1"               // Ícones
  },
  "devDependencies": {
    "eslint": "^8.34.0",
    "prettier": "^2.8.4",
    "@testing-library/react": "^14.0.0"   // Testes
  }
}
```

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---