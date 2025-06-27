const express = require('express');
const dotenv = require('dotenv');
const conectarBanco = require('./config/db');

dotenv.config();

conectarBanco();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'API de Doação de Objetos funcionando!',
    version: '1.0.0',
    endpoints: {
      objetos: '/api/objetos',
      estatisticas: '/api/objetos/estatisticas'
    }
  });
});

app.use('/api/objetos', require('./routes/objetos'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em: http://localhost:${PORT}`);
  console.log(`Estatísticas: http://localhost:${PORT}/api/objetos/estatisticas`);
});

module.exports = app;
