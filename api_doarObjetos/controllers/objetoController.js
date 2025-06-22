const Objeto = require('../models/Objeto');

// Buscar todos os objetos disponíveis
const buscarTodos = async (req, res) => {
  try {
    const { categoria, cidade, estado, disponivel = true } = req.query;
    
    let filtro = { disponivel };
    
    if (categoria) {
      filtro.categoria = categoria;
    }
    
    if (cidade) {
      filtro['localizacao.cidade'] = { $regex: cidade, $options: 'i' };
    }
    
    if (estado) {
      filtro.estado = estado;
    }
    
    const objetos = await Objeto.find(filtro)
      .sort({ dataDoacao: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: objetos.length,
      data: objetos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar objetos',
      error: error.message
    });
  }
};

// Buscar objeto por ID
const buscarPorId = async (req, res) => {
  try {
    const objeto = await Objeto.findById(req.params.id);
    
    if (!objeto) {
      return res.status(404).json({
        success: false,
        message: 'Objeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: objeto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar objeto',
      error: error.message
    });
  }
};

// Criar novo objeto
const criar = async (req, res) => {
  try {
    const objeto = await Objeto.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Objeto criado com sucesso',
      data: objeto
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: mensagens
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar objeto',
      error: error.message
    });
  }
};

// Atualizar objeto
const atualizar = async (req, res) => {
  try {
    const objeto = await Objeto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!objeto) {
      return res.status(404).json({
        success: false,
        message: 'Objeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Objeto atualizado com sucesso',
      data: objeto
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: mensagens
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar objeto',
      error: error.message
    });
  }
};

// Deletar objeto
const deletar = async (req, res) => {
  try {
    const objeto = await Objeto.findByIdAndDelete(req.params.id);
    
    if (!objeto) {
      return res.status(404).json({
        success: false,
        message: 'Objeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Objeto deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar objeto',
      error: error.message
    });
  }
};

// Marcar objeto como indisponível
const marcarIndisponivel = async (req, res) => {
  try {
    const objeto = await Objeto.findByIdAndUpdate(
      req.params.id,
      { disponivel: false },
      { new: true }
    );
    
    if (!objeto) {
      return res.status(404).json({
        success: false,
        message: 'Objeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Objeto marcado como indisponível',
      data: objeto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar objeto como indisponível',
      error: error.message
    });
  }
};

// Buscar estatísticas
const buscarEstatisticas = async (req, res) => {
  try {
    const totalObjetos = await Objeto.countDocuments();
    const objetosDisponiveis = await Objeto.countDocuments({ disponivel: true });
    const objetosPorCategoria = await Objeto.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const objetosPorCidade = await Objeto.aggregate([
      { $group: { _id: '$localizacao.cidade', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalObjetos,
        disponiveis: objetosDisponiveis,
        porCategoria: objetosPorCategoria,
        porCidade: objetosPorCidade
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
};

module.exports = {
  buscarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  marcarIndisponivel,
  buscarEstatisticas
}; 