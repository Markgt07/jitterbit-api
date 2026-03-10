/**
 * Middleware para rotas não encontradas (404).
 * Captura qualquer requisição para uma rota inexistente.
 */
const notFound = (req, res) =>
  res.status(404).json({ error: `Rota '${req.originalUrl}' não encontrada` });

/**
 * Middleware global de tratamento de erros.
 * Captura erros não tratados nos controllers e retorna uma resposta padronizada.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Erro interno do servidor' });
};

module.exports = { notFound, errorHandler };
