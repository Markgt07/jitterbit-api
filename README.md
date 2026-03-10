# 🛒 Jitterbit Orders API

API RESTful para gerenciamento de pedidos desenvolvida como desafio técnico para a Jitterbit (Professional Services).

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## 🚀 Tecnologias

- **Node.js** + **Express** — servidor HTTP
- **MongoDB** + **Mongoose** — banco de dados
- **Jest** + **Supertest** — testes de integração
- **dotenv** — gerenciamento de variáveis de ambiente
- **nodemon** — hot-reload em desenvolvimento

---

## ⚙️ Instalação
```bash
# Clone o repositório
git clone https://github.com/Markgt07/jitterbit-api.git
cd jitterbit-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

---

## 🔧 Variáveis de Ambiente

Configure o arquivo `.env` com os seguintes valores:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `MONGODB_URI` | URI de conexão do MongoDB | `mongodb://localhost:27017/jitterbit_orders` |
| `NODE_ENV` | Ambiente de execução | `development` |

---

## 🗄️ Configuração do Banco de Dados

O banco de dados utilizado é o **MongoDB**. Não é necessário criar tabelas ou collections manualmente — o Mongoose cria a estrutura automaticamente na primeira execução da API.

Você pode rodar o projeto de duas formas:

---

### 🐳 Opção 1 — Com Docker (recomendado)

> Não precisa instalar Node.js nem MongoDB na máquina. Basta ter o [Docker](https://www.docker.com/) instalado.
```bash
# Sobe a API e o MongoDB juntos com um único comando
docker-compose up
```

A API estará disponível em `http://localhost:3000` e o MongoDB subirá automaticamente em um container isolado.

Para encerrar:
```bash
docker-compose down
```

---

### 💻 Opção 2 — Sem Docker (ambiente local)

> Requer **Node.js 18+** e **MongoDB** instalados na máquina.

**1. Instale o MongoDB** (caso não tenha):
```bash
# Ubuntu/WSL
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
```

**2. Inicie o MongoDB:**
```bash
sudo systemctl start mongod
```

**3. Suba a API:**
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.

---

## ▶️ Scripts disponíveis
```bash
npm run dev   # Desenvolvimento com hot-reload
npm start     # Produção
npm test      # Testes de integração
```

---

## 📡 Endpoints

| Método | Rota | Descrição | Obrigatório |
|--------|------|-----------|-------------|
| `POST` | `/order` | Criar pedido | ✅ |
| `GET` | `/order/:orderId` | Buscar pedido por número | ✅ |
| `GET` | `/order/list` | Listar todos os pedidos | ⬜ |
| `PUT` | `/order/:orderId` | Atualizar pedido | ⬜ |
| `DELETE` | `/order/:orderId` | Deletar pedido | ⬜ |
| `GET` | `/health` | Healthcheck da API | ⬜ |

---

## 📋 Exemplos de uso

### Criar pedido
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
    ]
  }'
```

### Buscar pedido
```bash
curl http://localhost:3000/order/v10089015vdb-01
```

### Listar todos os pedidos
```bash
curl http://localhost:3000/order/list
```

### Atualizar pedido
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -d '{ "valorTotal": 20000 }'
```

### Deletar pedido
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01
```

---

## 🔄 Mapeamento de Campos

A API recebe os dados em português e os transforma antes de salvar no banco:

| Body (entrada) | Banco de dados |
|----------------|----------------|
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `items[].idItem` | `items[].productId` |
| `items[].quantidadeItem` | `items[].quantity` |
| `items[].valorItem` | `items[].price` |

---

## 🗂️ Estrutura do Projeto
```
src/
├── config/
│   └── database.js          # Conexão com o MongoDB
├── controllers/
│   └── orderController.js   # Lógica de negócio + mapeamento de campos
├── middlewares/
│   └── errorMiddleware.js   # Handlers de 404 e erros globais
├── models/
│   └── Order.js             # Schema Mongoose
├── routes/
│   └── orderRoutes.js       # Definição das rotas
├── app.js                   # Configuração do Express
└── server.js                # Entry point
tests/
└── order.test.js            # Testes de integração
```

---

## 📦 Estrutura no MongoDB
```json
{
  "_id": "ObjectId(...)",
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "ISODate('2023-07-19T12:24:11.529Z')",
  "items": [
    { "productId": 2434, "quantity": 1, "price": 1000 }
  ]
}
```

---

## 📝 Códigos de Resposta HTTP

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Pedido criado com sucesso |
| `400` | Dados inválidos ou ausentes |
| `404` | Pedido não encontrado |
| `409` | Pedido já existe (duplicado) |
| `500` | Erro interno do servidor |
