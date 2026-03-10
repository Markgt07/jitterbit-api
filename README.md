# 🛒 Jitterbit Orders API

API RESTful para gerenciamento de pedidos — Desafio Técnico Jitterbit (Professional Services).

## 🚀 Tecnologias

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Jest** + **Supertest** (testes)

## ⚙️ Instalação
```bash
npm install
cp .env.example .env
```

## ▶️ Executar
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /order | Criar pedido |
| GET | /order/list | Listar todos os pedidos |
| GET | /order/:orderId | Buscar pedido por número |
| PUT | /order/:orderId | Atualizar pedido |
| DELETE | /order/:orderId | Deletar pedido |

## 📦 Exemplo de Request
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [{"idItem": "2434", "quantidadeItem": 1, "valorItem": 1000}]
  }'
```

## 🧪 Testes
```bash
npm test
```
