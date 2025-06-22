const mongoose = require('mongoose');

const objetoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do objeto é obrigatório'],
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['sofa', 'cadeira', 'armario', 'geladeira', 'mesa', 'cama', 'eletrodomestico', 'outros'],
    default: 'outros'
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  estado: {
    type: String,
    required: [true, 'Estado é obrigatório'],
    enum: ['novo', 'seminovo', 'usado', 'precisa_reparo'],
    default: 'usado'
  },
  localizacao: {
    cidade: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true
    },
    bairro: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true
    }
  },
  doador: {
    nome: {
      type: String,
      required: [true, 'Nome do doador é obrigatório'],
      trim: true
    },
    telefone: {
      type: String,
      required: [true, 'Telefone do doador é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email do doador é obrigatório'],
      trim: true,
      lowercase: true
    }
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  dataDoacao: {
    type: Date,
    default: Date.now
  },
  imagens: [{
    type: String,
    trim: true
  }],
  dimensoes: {
    largura: Number,
    altura: Number,
    profundidade: Number,
    unidade: {
      type: String,
      enum: ['cm', 'm'],
      default: 'cm'
    }
  }
}, {
  timestamps: true
});

// Índices para melhorar performance das consultas
objetoSchema.index({ categoria: 1, disponivel: 1 });
objetoSchema.index({ 'localizacao.cidade': 1 });
objetoSchema.index({ dataDoacao: -1 });

module.exports = mongoose.model('Objeto', objetoSchema); 