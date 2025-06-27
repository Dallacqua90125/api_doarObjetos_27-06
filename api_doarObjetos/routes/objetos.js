const express = require('express');
const router = express.Router();
const {
  buscarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  marcarIndisponivel,
  buscarEstatisticas
} = require('../controllers/objetoController');

router.route('/')
  .get(buscarTodos)    // GET /api/objetos - Buscar todos os objetos
  .post(criar);        // POST /api/objetos - Criar novo objeto

router.route('/estatisticas')
  .get(buscarEstatisticas); // GET /api/objetos/estatisticas - Buscar estatísticas

router.route('/:id')
  .get(buscarPorId)    // GET /api/objetos/:id - Buscar objeto por ID
  .put(atualizar)      // PUT /api/objetos/:id - Atualizar objeto
  .delete(deletar);    // DELETE /api/objetos/:id - Deletar objeto

router.route('/:id/indisponivel')
  .patch(marcarIndisponivel); // PATCH /api/objetos/:id/indisponivel - Marcar como indisponível

module.exports = router; 