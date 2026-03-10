const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware para parsing de JSON no body das requisições
app.use(express.json());

// Rota de healthcheck — verifica se a API está no ar
app.get('/health', (req, res) =>
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
);

// Rotas principais da aplicação
app.use('/order', orderRoutes);

// Middleware de rota não encontrada (deve vir após todas as rotas)
app.use(notFound);

// Middleware global de erros (deve ser o último middleware)
app.use(errorHandler);

module.exports = app;
