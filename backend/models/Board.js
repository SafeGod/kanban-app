const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del tablero es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  columns: [columnSchema],
  tasks: [taskSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar fecha de modificación antes de guardar
boardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Board', boardSchema);
