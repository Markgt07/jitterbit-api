const notFound = (req, res) =>
  res.status(404).json({ error: `Rota '${req.originalUrl}' não encontrada` });

const errorHandler = (err, req, res, next) =>
  res.status(err.statusCode || 500).json({ error: err.message || 'Erro interno do servidor' });

module.exports = { notFound, errorHandler };
