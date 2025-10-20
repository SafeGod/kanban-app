import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardService } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardData, setBoardData] = useState({
    name: '',
    description: ''
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const response = await boardService.getBoards();
      if (response.success) {
        setBoards(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar los tableros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (board = null) => {
    if (board) {
      // Modo edición
      setEditingBoard(board);
      setBoardData({
        name: board.name,
        description: board.description || ''
      });
    } else {
      // Modo creación
      setEditingBoard(null);
      setBoardData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBoard(null);
    setBoardData({ name: '', description: '' });
  };

  const handleSubmitBoard = async (e) => {
    e.preventDefault();
    
    if (!boardData.name.trim()) {
      toast.error('El nombre del tablero es requerido');
      return;
    }

    try {
      if (editingBoard) {
        // Actualizar tablero existente
        const response = await boardService.updateBoard(editingBoard._id, boardData);
        if (response.success) {
          toast.success('Tablero actualizado exitosamente');
          setBoards(boards.map(b => 
            b._id === editingBoard._id ? response.data : b
          ));
        }
      } else {
        // Crear nuevo tablero
        const response = await boardService.createBoard(boardData);
        if (response.success) {
          toast.success('Tablero creado exitosamente');
          setBoards([response.data, ...boards]);
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingBoard ? 'Error al actualizar el tablero' : 'Error al crear el tablero');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('¿Estás seguro de eliminar este tablero?')) {
      return;
    }

    try {
      await boardService.deleteBoard(boardId);
      toast.success('Tablero eliminado');
      setBoards(boards.filter(board => board._id !== boardId));
    } catch (error) {
      toast.error('Error al eliminar el tablero');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Sesión cerrada');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tableros...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Kanban Board</h1>
          <div className="navbar-actions">
            <span className="user-name">Hola, {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Mis Tableros</h2>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            + Nuevo Tablero
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes tableros aún</h3>
            <p>Crea tu primer tablero para empezar a organizar tus tareas</p>
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              Crear Primer Tablero
            </button>
          </div>
        ) : (
          <div className="boards-grid">
            {boards.map(board => (
              <div key={board._id} className="board-card">
                <div className="board-card-header">
                  <h3>{board.name}</h3>
                  <div className="board-card-actions">
                    <button
                      onClick={() => handleOpenModal(board)}
                      className="btn-icon"
                      title="Editar tablero"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board._id)}
                      className="btn-delete"
                      title="Eliminar tablero"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="board-description">
                  {board.description || 'Sin descripción'}
                </p>
                <div className="board-stats">
                  <span>{board.columns.length} columnas</span>
                  <span>{board.tasks.length} tareas</span>
                </div>
                <button
                  onClick={() => navigate(`/board/${board._id}`)}
                  className="btn btn-secondary btn-block"
                >
                  Abrir Tablero
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBoard ? 'Editar Tablero' : 'Crear Nuevo Tablero'}</h3>
              <button onClick={handleCloseModal} className="btn-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitBoard}>
              <div className="form-group">
                <label htmlFor="name">Nombre del Tablero *</label>
                <input
                  type="text"
                  id="name"
                  value={boardData.name}
                  onChange={(e) => setBoardData({ ...boardData, name: e.target.value })}
                  placeholder="Ej: Proyecto Web"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={boardData.description}
                  onChange={(e) => setBoardData({ ...boardData, description: e.target.value })}
                  placeholder="Describe tu proyecto..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBoard ? 'Actualizar' : 'Crear'} Tablero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;