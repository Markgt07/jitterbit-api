const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));
app.use('/order', orderRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
