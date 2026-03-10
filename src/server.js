require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`   POST   /order`);
    console.log(`   GET    /order/list`);
    console.log(`   GET    /order/:orderId`);
    console.log(`   PUT    /order/:orderId`);
    console.log(`   DELETE /order/:orderId`);
  });
};

startServer();
