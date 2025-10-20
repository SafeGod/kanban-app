# 🚀 Guía de Inicio Rápido - Kanban Board

## ⚡ Instalación en 3 Pasos

### Opción A: Script Automático (Linux/Mac)

```bash
# 1. Ejecutar script de instalación
chmod +x install.sh
./install.sh

# 2. Iniciar MongoDB
sudo systemctl start mongodb

# 3a. Terminal 1 - Backend
cd backend
npm start

# 3b. Terminal 2 - Frontend
cd frontend
npm start
```

### Opción B: Manual

```bash
# 1. Backend
cd backend
npm install
npm start

# 2. Frontend (nueva terminal)
cd frontend
npm install
npm start

# 3. Asegúrate de que MongoDB esté corriendo
```

## 🎮 Primer Uso

1. **Registro**: Abre http://localhost:3000 y crea una cuenta
2. **Crear Tablero**: Haz clic en "+ Nuevo Tablero"
3. **Añadir Tareas**: Usa el botón "+" en cualquier columna
4. **Arrastrar y Soltar**: ¡Mueve tus tareas entre columnas!

## 📚 Comandos Útiles

### Backend (Puerto 5000)
```bash
npm start        # Iniciar servidor
npm run dev      # Modo desarrollo con auto-reload
```

### Frontend (Puerto 3000)
```bash
npm start        # Iniciar aplicación React
npm run build    # Compilar para producción
```

## 🔧 Configuración Rápida

### Variables de Entorno (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban_db
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🎯 Funcionalidades Clave

| Función | Descripción | Ubicación |
|---------|-------------|-----------|
| **Registro** | Crear cuenta nueva | /register |
| **Login** | Iniciar sesión | /login |
| **Dashboard** | Ver todos los tableros | /dashboard |
| **Tablero** | Ver y gestionar tareas | /board/:id |
| **Drag & Drop** | Mover tareas entre columnas | En el tablero |
| **Crear Tarea** | Botón + en cada columna | En el tablero |
| **Editar Tarea** | Icono ✏️ en cada tarea | En el tablero |
| **Eliminar** | Icono 🗑️ | Tableros, columnas, tareas |

## 📱 Atajos de Teclado

- `Esc` - Cerrar modales
- `Enter` - Enviar formularios

## 🐛 Solución Rápida de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongod --version
sudo systemctl status mongodb
```

### Puerto en uso
```bash
# Cambiar puerto en backend/.env
PORT=5001

# O matar el proceso
lsof -ti:5000 | xargs kill -9
```

### Error de CORS
```bash
# Verificar que backend esté en puerto 5000
# Verificar URL en frontend/src/services/api.js
```

### Token inválido
```javascript
// En la consola del navegador:
localStorage.clear()
// Luego vuelve a iniciar sesión
```

## 📊 Estructura de Datos

### Usuario
```json
{
  "name": "Tu Nombre",
  "email": "tu@email.com",
  "password": "hasheada_por_bcrypt"
}
```

### Tablero
```json
{
  "name": "Mi Proyecto",
  "description": "Descripción opcional",
  "columns": [
    {"name": "Por Hacer", "order": 0},
    {"name": "En Progreso", "order": 1},
    {"name": "Hecho", "order": 2}
  ],
  "tasks": [
    {
      "title": "Mi tarea",
      "description": "Detalles...",
      "columnId": "id_de_columna",
      "dueDate": "2025-12-31",
      "order": 0
    }
  ]
}
```

## 🔐 Credenciales de Prueba

No hay credenciales preconfiguradas. Crea tu propia cuenta usando el formulario de registro.

## 🎨 Personalización

### Cambiar colores
Edita `frontend/src/styles/index.css`:
```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colores de botones */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Cambiar puerto frontend
Crea `frontend/.env`:
```
PORT=3001
```

## 📈 Próximos Pasos

1. ✅ Familiarízate con la interfaz
2. ✅ Crea tu primer tablero
3. ✅ Añade algunas tareas
4. ✅ Prueba el drag and drop
5. ✅ Explora todas las funcionalidades
6. 📖 Lee el README.md completo
7. 🏗️ Revisa ARCHITECTURE.md para entender el sistema
8. 🚀 ¡Empieza a gestionar tus proyectos!

## 🆘 ¿Necesitas Ayuda?

- 📖 Consulta el README.md para más detalles
- 🏗️ Revisa ARCHITECTURE.md para entender la arquitectura
- 🐛 Reporta problemas en el repositorio

## 🎉 ¡Listo!

Tu aplicación Kanban está corriendo en:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000 (endpoint raíz)

¡Disfruta organizando tus proyectos! 🎯
