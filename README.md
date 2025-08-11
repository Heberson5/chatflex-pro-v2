# Chatflex Pro — GitHub Ready (Frontend + Backend)

Interface moderna e responsiva com chat, fluxos (React Flow), canais WhatsApp (Evolution API e Cloud API), dashboard (Recharts), RBAC e tema claro/escuro.
Projeto pronto para subir no **GitHub** e rodar localmente com **Node.js** e **PostgreSQL**.

## Estrutura
```
chatflex-pro-github/
  backend/
    src/
    package.json
    .env.example
  frontend/
    src/
    index.html
    package.json
  README.md (este arquivo)
```

## Requisitos
- Node.js 20+
- PostgreSQL 15+
- (Opcional) Evolution API para testes de WhatsApp

## Passo a passo (dev local)
1) Clone o repositório (ou extraia este .zip)  
2) Crie o banco no Postgres:
   ```sql
   CREATE DATABASE chatflex;
   ```
3) Backend
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
   - API: http://localhost:3000/api/health

4) Frontend (em outro terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Front: http://localhost:5173

5) Login Master (semente automática ao subir backend):
   - Email: **hebersohas@gmail.com**
   - Senha: **Guga430512**

## Subir no GitHub
```bash
git init
git add .
git commit -m "Chatflex Pro - initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/chatflex-pro.git
git push -u origin main
```

## Configurar WhatsApp
- **Evolution API** (recomendado em homologação): configure a URL na `.env` do backend e use a tela **Canais** no frontend para criar sessão e obter QR.
- **Cloud API (Meta)**: preencha `CLOUD_WA_TOKEN` e `CLOUD_WA_PHONE_ID` na `.env` do backend.

## Observações
- O endpoint de IA nos fluxos está **stubado** para funcionar offline; plugar GPT/Gemini/DeepSeek depois é simples adicionando a chave na `.env` e o cliente correspondente.
- O projeto foi organizado para facilitar testes e evolução incremental (services/controllers).

Gerado em: 2025-08-11T10:11:43.671593Z
