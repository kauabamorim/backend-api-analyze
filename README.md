# 🧠 backend-api-analize  

API inteligente para avaliação de ideias de negócio usando inteligência artificial (GPT-4).  

> Plataforma: **Analise** — Potencialize suas ideias com feedback técnico, inovador e de mercado.  

---

## 🚀 Funcionalidades  

- Avaliação de ideias de negócio baseada em:  
  - Viabilidade técnica  
  - Potencial de mercado  
  - Grau de inovação  
  - Possíveis desafios  
  - Sugestões de melhoria  
- Persistência das análises em **AWS RDS (PostgreSQL)**  
- Integração com **Prisma ORM** para abstração do banco de dados  
- Estrutura em **Node.js + TypeScript**  
- Integração com **OpenAI GPT-4**  
- **Testes unitários e de integração** com **Jest + Supertest**  
- API REST com endpoint `/api/analyze`  

---

## 📦 Tecnologias  

- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [OpenAI API](https://platform.openai.com/)  
- [AWS RDS (PostgreSQL)](https://aws.amazon.com/rds/)  
- [Prisma ORM](https://www.prisma.io/)  
- [Jest](https://jestjs.io/)  
- [Supertest](https://github.com/ladjs/supertest)  
- [dotenv](https://www.npmjs.com/package/dotenv)  

---

## 📁 Estrutura do Projeto  

```
src/
├── routes/
│   └── analyze.ts         # Rota principal da API
├── services/
│   ├── openaiService.ts   # Comunicação com a OpenAI
│   └── dbService.ts       # Operações com o banco de dados
├── mappers/
│   └── analyzeMapper.ts   # Conversão da resposta da OpenAI em JSON estruturado
├── middlewares/
│   └── auth.ts            # Middleware de autenticação
├── lib/
│   └── prisma.ts          # Configuração do Prisma Client
├── tests/
│   ├── unit/              # Testes unitários
│   └── integration/       # Testes de integração
└── index.ts               # Ponto de entrada do servidor Express
```  

---

## ⚙️ Configuração  

### Pré-requisitos  
- Node.js e npm/yarn instalados  
- Banco de dados MySQL (ex: **AWS RDS**)  

### Variáveis de Ambiente  

Crie um arquivo `.env` na raiz do projeto com:  

```env
OPENAI_API_KEY=sua_chave_aqui
DATABASE_URL="mysql://user:password@host:port/database?schema=public"
```  

### Instalação  

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/backend-api-analize.git

# Entrar na pasta
cd backend-api-analize

# Instalar dependências
npm install
```

---

## ▶️ Executando a API  

### Desenvolvimento  
```bash
npm run dev
```

### Produção  
```bash
npm run build
npm start
```  

---

## 🧪 Testes  

Rodar todos os testes unitários e de integração:  
```bash
npm run test
```

Rodar com relatório de cobertura:  
```bash
npm run test:coverage
```  

---

## 🔍 Exemplo de Requisição  

**POST** `/api/analyze`  

### Request  
```json
{
  "idea": "Aplicativo que conecta pequenos produtores rurais com consumidores urbanos."
}
```  

### Response  
```json
{
  "id": "uuid-da-analise",
  "idea": "Aplicativo que conecta pequenos produtores rurais com consumidores urbanos.",
  "viability": "...",
  "marketPotential": "...",
  "innovation": "...",
  "challenges": "...",
  "suggestions": "...",
  "fullText": "...",
  "createdAt": "2025-09-09T22:30:00Z"
}
```  
