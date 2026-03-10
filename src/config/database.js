const mongoose = require('mongoose');

/**
 * Estabelece a conexão com o banco de dados MongoDB.
 * A URI é lida do arquivo .env (MONGODB_URI).
 * Se a conexão falhar, o processo é encerrado.
 */
const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jitterbit_orders';
    await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
};

module.exports = connectDatabase;
