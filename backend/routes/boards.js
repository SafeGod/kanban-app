const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Board = require('../models/Board');
const { protect } = require('../middleware/auth');

// Todas las rutas están protegidas
router.use(protect);

// @route   GET /api/boards
// @desc    Obtener todos los tableros del usuario
// @access  Private
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: boards.length,
      data: boards
    });
  } catch (error) {
    console.error('Error obteniendo tableros:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   GET /api/boards/:id
// @desc    Obtener un tablero específico
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para acceder a este tablero'
      });
    }

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error obteniendo tablero:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   POST /api/boards
// @desc    Crear nuevo tablero
// @access  Private
router.post('/', [
  body('name').trim().notEmpty().withMessage('El nombre del tablero es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description } = req.body;

    // Crear columnas por defecto
    const defaultColumns = [
      { name: 'Por Hacer', order: 0 },
      { name: 'En Progreso', order: 1 },
      { name: 'Hecho', order: 2 }
    ];

    const board = await Board.create({
      name,
      description,
      owner: req.user.id,
      columns: defaultColumns,
      tasks: []
    });

    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error creando tablero:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   PUT /api/boards/:id
// @desc    Actualizar tablero
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para modificar este tablero'
      });
    }

    const { name, description } = req.body;
    board.name = name || board.name;
    board.description = description !== undefined ? description : board.description;

    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error actualizando tablero:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   DELETE /api/boards/:id
// @desc    Eliminar tablero
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este tablero'
      });
    }

    await board.deleteOne();

    res.json({
      success: true,
      message: 'Tablero eliminado correctamente'
    });
  } catch (error) {
    console.error('Error eliminando tablero:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// ========== RUTAS DE COLUMNAS ==========

// @route   POST /api/boards/:id/columns
// @desc    Añadir columna al tablero
// @access  Private
router.post('/:id/columns', [
  body('name').trim().notEmpty().withMessage('El nombre de la columna es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { name } = req.body;
    const order = board.columns.length;

    board.columns.push({ name, order });
    await board.save();

    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error añadiendo columna:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   PUT /api/boards/:id/columns/:columnId
// @desc    Actualizar columna
// @access  Private
router.put('/:id/columns/:columnId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Columna no encontrada'
      });
    }

    const { name } = req.body;
    if (name) column.name = name;

    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error actualizando columna:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   DELETE /api/boards/:id/columns/:columnId
// @desc    Eliminar columna
// @access  Private
router.delete('/:id/columns/:columnId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Eliminar todas las tareas de esta columna
    board.tasks = board.tasks.filter(task => task.columnId.toString() !== req.params.columnId);

    // Eliminar la columna
    board.columns = board.columns.filter(col => col._id.toString() !== req.params.columnId);

    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error eliminando columna:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// ========== RUTAS DE TAREAS ==========

// @route   POST /api/boards/:id/tasks
// @desc    Añadir tarea al tablero
// @access  Private
router.post('/:id/tasks', [
  body('title').trim().notEmpty().withMessage('El título de la tarea es requerido'),
  body('columnId').notEmpty().withMessage('El ID de la columna es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { title, description, columnId, dueDate } = req.body;

    // Verificar que la columna existe
    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Columna no encontrada'
      });
    }

    // Obtener el order más alto en esa columna
    const tasksInColumn = board.tasks.filter(t => t.columnId.toString() === columnId);
    const order = tasksInColumn.length;

    board.tasks.push({
      title,
      description,
      columnId,
      order,
      dueDate
    });

    await board.save();

    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error añadiendo tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   PUT /api/boards/:id/tasks/:taskId
// @desc    Actualizar tarea
// @access  Private
router.put('/:id/tasks/:taskId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const task = board.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    const { title, description, dueDate } = req.body;
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   PUT /api/boards/:id/tasks/:taskId/move
// @desc    Mover tarea a otra columna (drag and drop)
// @access  Private
router.put('/:id/tasks/:taskId/move', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const task = board.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    const { columnId, order } = req.body;

    // Verificar que la nueva columna existe
    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: 'Columna no encontrada'
      });
    }

    const oldColumnId = task.columnId;
    task.columnId = columnId;
    task.order = order;

    // Reorganizar las tareas en ambas columnas
    const tasksToReorder = board.tasks.filter(t => 
      t.columnId.toString() === oldColumnId.toString() || 
      t.columnId.toString() === columnId
    );

    tasksToReorder.forEach((t, index) => {
      if (t._id.toString() !== task._id.toString()) {
        const tasksInSameColumn = board.tasks.filter(
          task => task.columnId.toString() === t.columnId.toString() && 
                  task._id.toString() !== req.params.taskId
        );
        t.order = tasksInSameColumn.findIndex(task => task._id.toString() === t._id.toString());
      }
    });

    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error moviendo tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @route   DELETE /api/boards/:id/tasks/:taskId
// @desc    Eliminar tarea
// @access  Private
router.delete('/:id/tasks/:taskId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tablero no encontrado'
      });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    board.tasks = board.tasks.filter(task => task._id.toString() !== req.params.taskId);
    await board.save();

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

module.exports = router;
