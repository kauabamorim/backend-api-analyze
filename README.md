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
- Estrutura em Node.js + TypeScript
- Integração com OpenAI GPT-4
- API REST com endpoint `/api/analyze`

---

## 📦 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://platform.openai.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📁 Estrutura do Projeto

```
src/
├── routes/
│   └── analyze.ts         # Rota principal da API
├── services/
│   └── openaiService.ts   # Comunicação com a OpenAI
├── mappers/
│   └── analyzeMapper.ts   # Conversão da resposta bruta em JSON estruturado
└── index.ts               # Ponto de entrada do servidor Express
```

---

## 🔍 Exemplo de Requisição

**POST** `/api/analyze`

```json
{
  "idea": "Aplicativo que conecta pequenos produtores rurais com consumidores urbanos."
}
```

**Resposta:**

```json
{
  "viability": "...",
  "marketPotential": "...",
  "innovation": "...",
  "challenges": "...",
  "suggestions": "...",
  "fullText": "..."
}
```
