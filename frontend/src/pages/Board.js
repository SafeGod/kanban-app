import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { boardService } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import '../styles/Board.css';

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState('');

  const loadBoard = useCallback(async () => {
    try {
      const response = await boardService.getBoard(id);
      if (response.success) {
        setBoard(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar el tablero');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // No hay destino o misma posición
    if (!destination || (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )) {
      return;
    }

    const taskId = draggableId;
    const newColumnId = destination.droppableId;
    const newOrder = destination.index;

    // Crear copia profunda del board
    const updatedBoard = JSON.parse(JSON.stringify(board));
    const taskIndex = updatedBoard.tasks.findIndex(t => 
      String(t._id) === String(taskId)
    );
    
    if (taskIndex !== -1) {
      // Actualizar la tarea
      updatedBoard.tasks[taskIndex].columnId = newColumnId;
      updatedBoard.tasks[taskIndex].order = newOrder;

      // Reordenar todas las tareas en las columnas afectadas
      const affectedColumns = [source.droppableId, destination.droppableId];
      affectedColumns.forEach(colId => {
        const tasksInColumn = updatedBoard.tasks
          .filter(t => String(t.columnId) === String(colId))
          .sort((a, b) => a.order - b.order);
        
        tasksInColumn.forEach((t, idx) => {
          const tIndex = updatedBoard.tasks.findIndex(task => 
            String(task._id) === String(t._id)
          );
          if (tIndex !== -1) {
            updatedBoard.tasks[tIndex].order = idx;
          }
        });
      });

      setBoard(updatedBoard);

      try {
        await boardService.moveTask(id, taskId, {
          columnId: newColumnId,
          order: newOrder
        });
        // Recargar para sincronizar con el servidor
        await loadBoard();
      } catch (error) {
        toast.error('Error al mover la tarea');
        loadBoard(); // Recargar en caso de error
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTaskData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const taskData = {
        ...newTaskData,
        columnId: selectedColumnId
      };

      if (editingTask) {
        await boardService.updateTask(id, editingTask._id, newTaskData);
        toast.success('Tarea actualizada');
      } else {
        await boardService.addTask(id, taskData);
        toast.success('Tarea creada');
      }

      await loadBoard();
      handleCloseTaskModal();
    } catch (error) {
      toast.error('Error al guardar la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;

    try {
      await boardService.deleteTask(id, taskId);
      toast.success('Tarea eliminada');
      await loadBoard();
    } catch (error) {
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleAddColumn = async (e) => {
    e.preventDefault();

    if (!newColumnName.trim()) {
      toast.error('El nombre de la columna es requerido');
      return;
    }

    try {
      await boardService.addColumn(id, { name: newColumnName });
      toast.success('Columna añadida');
      await loadBoard();
      setShowColumnModal(false);
      setNewColumnName('');
    } catch (error) {
      toast.error('Error al añadir columna');
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm('¿Eliminar esta columna y todas sus tareas?')) return;

    try {
      await boardService.deleteColumn(id, columnId);
      toast.success('Columna eliminada');
      await loadBoard();
    } catch (error) {
      toast.error('Error al eliminar columna');
    }
  };

  const openEditColumnModal = (column) => {
    setEditingColumnId(String(column._id));
    setEditingColumnName(column.name || '');
    setShowColumnModal(true);
  };

  const handleCancelEditColumn = () => {
    setEditingColumnId(null);
    setEditingColumnName('');
    setShowColumnModal(false);
  };

  const handleSaveEditColumn = async (e, columnId) => {
    e.preventDefault();
    const name = editingColumnName.trim();
    if (!name) {
      toast.error('El nombre de la columna es requerido');
      return;
    }

    try {
      const response = await boardService.updateColumn(id, columnId, { name });
      if (response.success) {
        toast.success('Columna actualizada');
        await loadBoard();
      }
      handleCancelEditColumn();
    } catch (error) {
      toast.error('Error al actualizar la columna');
    }
  };

  const openTaskModal = (columnId, task = null) => {
    setSelectedColumnId(columnId);
    if (task) {
      setEditingTask(task);
      setNewTaskData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
    } else {
      setEditingTask(null);
      setNewTaskData({ title: '', description: '', dueDate: '' });
    }
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setNewTaskData({ title: '', description: '', dueDate: '' });
    setSelectedColumnId(null);
  };

  const getTasksForColumn = (columnId) => {
    if (!board || !board.tasks) return [];
    
    return board.tasks
      .filter(task => {
        const taskColId = task.columnId?._id || task.columnId;
        const colId = columnId?._id || columnId;
        return String(taskColId) === String(colId);
      })
      .sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tablero...</p>
      </div>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <div className="board-page">
      <nav className="navbar">
        <div className="navbar-content">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Volver
          </button>
          <h1>{board.name}</h1>
          <button onClick={() => setShowColumnModal(true)} className="btn btn-primary">
            + Añadir Columna
          </button>
        </div>
      </nav>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {board.columns && board.columns.sort((a, b) => a.order - b.order).map(column => {
            const columnId = String(column._id);
            const tasksInColumn = getTasksForColumn(column._id);
            
            return (
              <div key={columnId} className="column">
                <div className="column-header">
                  {editingColumnId === columnId ? (
                    <form className="column-edit-form" onSubmit={(e) => handleSaveEditColumn(e, column._id)}>
                      <input
                        type="text"
                        value={editingColumnName}
                        onChange={(e) => setEditingColumnName(e.target.value)}
                        className="column-edit-input"
                        autoFocus
                      />
                      <div className="column-actions">
                        <button type="button" onClick={handleCancelEditColumn} className="btn btn-secondary">Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3>{column.name}</h3>
                      <div className="column-actions">
                        <button
                          onClick={() => openTaskModal(column._id)}
                          className="btn-icon"
                          title="Añadir tarea"
                        >
                          +
                        </button>
                        <button
                          onClick={() => openEditColumnModal(column)}
                          className="btn-icon"
                          title="Editar columna"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteColumn(column._id)}
                          className="btn-icon btn-danger"
                          title="Eliminar columna"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {tasksInColumn.map((task, index) => {
                        const taskId = String(task._id);
                        return (
                          <Draggable key={taskId} draggableId={taskId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              >
                                <h4>{task.title}</h4>
                                {task.description && (
                                  <p className="task-description">{task.description}</p>
                                )}
                                {task.dueDate && (
                                  <div className="task-due-date">
                                    📅 {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                                  </div>
                                )}
                                <div className="task-actions">
                                  <button
                                    onClick={() => openTaskModal(column._id, task)}
                                    className="btn-task-edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="btn-task-delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      {tasksInColumn.length === 0 && (
                        <div className="empty-column">
                          No hay tareas
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal para añadir/editar tarea */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={handleCloseTaskModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
              <button onClick={handleCloseTaskModal} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  type="text"
                  id="title"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="Título de la tarea"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  placeholder="Detalles de la tarea..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Fecha de Vencimiento</label>
                <input
                  type="date"
                  id="dueDate"
                  value={newTaskData.dueDate}
                  onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseTaskModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Actualizar' : 'Crear'} Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para añadir columna */}
      {showColumnModal && (
        <div className="modal-overlay" onClick={() => setShowColumnModal(false)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingColumnId ? 'Editar Columna' : 'Nueva Columna'}</h3>
              <button onClick={() => { setShowColumnModal(false); handleCancelEditColumn(); }} className="btn-close">✕</button>
            </div>
            <form onSubmit={editingColumnId ? (e) => handleSaveEditColumn(e, editingColumnId) : handleAddColumn}>
              <div className="form-group">
                <label htmlFor="columnName">Nombre de la Columna *</label>
                <input
                  type="text"
                  id="columnName"
                  value={editingColumnId ? editingColumnName : newColumnName}
                  onChange={(e) => editingColumnId ? setEditingColumnName(e.target.value) : setNewColumnName(e.target.value)}
                  placeholder="Ej: En Revisión"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => { setShowColumnModal(false); handleCancelEditColumn(); }} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingColumnId ? 'Guardar cambios' : 'Añadir Columna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;