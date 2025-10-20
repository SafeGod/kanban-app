# 🎯 Kanban Board - Sistema de Gestión de Tareas y Proyectos

Una aplicación web completa para gestionar tareas y proyectos mediante tableros Kanban con funcionalidad de arrastrar y soltar (drag and drop).

## 📋 Características Principales

### ✅ Funcionalidades Implementadas

- **Autenticación Completa**: Sistema de registro e inicio de sesión con contraseñas encriptadas (bcrypt)
- **Gestión de Proyectos**: Crear, ver, editar y eliminar tableros de proyectos
- **Gestión de Tareas**: Añadir, editar y eliminar tareas con título, descripción y fecha de vencimiento
- **Columnas Personalizables**: Crear, renombrar y eliminar columnas del tablero
- **Drag and Drop**: Arrastrar y soltar tareas entre columnas de forma fluida
- **Persistencia en Tiempo Real**: Todos los cambios se guardan automáticamente en MongoDB
- **Interfaz Moderna**: Diseño responsive y atractivo con animaciones suaves
- **Protección de Rutas**: Middleware JWT para proteger endpoints privados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **Express**: Framework web
- **MongoDB** con **Mongoose**: Base de datos NoSQL
- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas
- **express-validator**: Validación de datos

### Frontend
- **React 18**: Biblioteca UI
- **React Router v6**: Enrutamiento
- **react-beautiful-dnd**: Funcionalidad drag and drop
- **Axios**: Cliente HTTP
- **React Toastify**: Notificaciones
- **date-fns**: Manejo de fechas

## 📁 Estructura del Proyecto

```
kanban-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticación JWT
│   ├── models/
│   │   ├── User.js               # Modelo de usuario
│   │   └── Board.js              # Modelo de tablero (incluye columnas y tareas)
│   ├── routes/
│   │   ├── auth.js               # Rutas de autenticación
│   │   └── boards.js             # Rutas de tableros, columnas y tareas
│   ├── .env.example              # Variables de entorno de ejemplo
│   ├── package.json
│   └── server.js                 # Servidor principal
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.js   # Componente para proteger rutas
    │   ├── context/
    │   │   └── AuthContext.js    # Context API para autenticación
    │   ├── pages/
    │   │   ├── Login.js          # Página de inicio de sesión
    │   │   ├── Register.js       # Página de registro
    │   │   ├── Dashboard.js      # Dashboard con lista de tableros
    │   │   └── Board.js          # Tablero Kanban con drag & drop
    │   ├── services/
    │   │   └── api.js            # Servicio de API con Axios
    │   ├── styles/
    │   │   ├── index.css         # Estilos globales
    │   │   ├── Auth.css          # Estilos de autenticación
    │   │   ├── Dashboard.css     # Estilos del dashboard
    │   │   └── Board.css         # Estilos del tablero
    │   ├── App.js                # Componente principal con rutas
    │   └── index.js              # Punto de entrada
    └── package.json
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (instalado y ejecutándose)
- npm o yarn

### 1. Clonar el Repositorio

```bash
# Si estás usando git
git clone <url-del-repositorio>
cd kanban-app
```

### 2. Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
# nano .env  (o tu editor preferido)
```

**Configuración del archivo .env:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban_db
JWT_SECRET=tu_secreto_jwt_muy_seguro_cambiar_en_produccion
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Iniciar MongoDB

```bash
# En una terminal separada, asegúrate de que MongoDB esté corriendo
# En Linux/Mac:
sudo systemctl start mongodb
# o
mongod

# En Windows:
# MongoDB debería iniciarse automáticamente como servicio
```

### 4. Iniciar el Servidor Backend

```bash
# En la carpeta backend
npm start

# Para desarrollo con auto-reload:
npm run dev
```

El servidor estará corriendo en `http://localhost:5000`

### 5. Configurar el Frontend

```bash
# En una nueva terminal, navegar a la carpeta del frontend
cd ../frontend

# Instalar dependencias
npm install
```

### 6. Iniciar la Aplicación Frontend

```bash
# En la carpeta frontend
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 📖 Uso de la Aplicación

### 1. Registro e Inicio de Sesión

1. Abre `http://localhost:3000` en tu navegador
2. Haz clic en "Regístrate aquí" para crear una nueva cuenta
3. Completa el formulario de registro
4. Serás redirigido automáticamente al dashboard

### 2. Crear un Tablero

1. En el dashboard, haz clic en "+ Nuevo Tablero"
2. Ingresa un nombre y descripción (opcional)
3. Haz clic en "Crear Tablero"

### 3. Gestionar Columnas

- **Columnas por defecto**: Cada tablero nuevo incluye 3 columnas: "Por Hacer", "En Progreso", "Hecho"
- **Añadir columna**: Clic en "+ Añadir Columna" en la barra superior
- **Eliminar columna**: Clic en el icono 🗑️ en el encabezado de la columna

### 4. Gestionar Tareas

#### Crear Tarea
1. Haz clic en el botón "+" en el encabezado de cualquier columna
2. Completa el formulario:
   - Título (requerido)
   - Descripción (opcional)
   - Fecha de vencimiento (opcional)
3. Haz clic en "Crear Tarea"

#### Editar Tarea
- Haz clic en el icono ✏️ de cualquier tarea
- Modifica los campos necesarios
- Guarda los cambios

#### Mover Tareas (Drag & Drop)
- **Haz clic y arrastra** cualquier tarea
- Suéltala en la columna deseada
- El cambio se guarda automáticamente

#### Eliminar Tarea
- Haz clic en el icono 🗑️ de la tarea
- Confirma la eliminación

## 🔑 API Endpoints

### Autenticación

```
POST /api/auth/register - Registrar nuevo usuario
POST /api/auth/login    - Iniciar sesión
GET  /api/auth/me       - Obtener usuario actual (requiere autenticación)
```

### Tableros

```
GET    /api/boards           - Obtener todos los tableros del usuario
GET    /api/boards/:id       - Obtener un tablero específico
POST   /api/boards           - Crear nuevo tablero
PUT    /api/boards/:id       - Actualizar tablero
DELETE /api/boards/:id       - Eliminar tablero
```

### Columnas

```
POST   /api/boards/:id/columns              - Añadir columna
PUT    /api/boards/:id/columns/:columnId    - Actualizar columna
DELETE /api/boards/:id/columns/:columnId    - Eliminar columna
```

### Tareas

```
POST   /api/boards/:id/tasks                    - Añadir tarea
PUT    /api/boards/:id/tasks/:taskId            - Actualizar tarea
PUT    /api/boards/:id/tasks/:taskId/move       - Mover tarea (drag & drop)
DELETE /api/boards/:id/tasks/:taskId            - Eliminar tarea
```

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt (10 salt rounds)
- Autenticación JWT con tokens que expiran
- Validación de datos en el backend con express-validator
- Protección de rutas con middleware de autenticación
- CORS configurado para permitir peticiones del frontend

## 🎨 Características de UI/UX

- **Diseño Responsive**: Funciona perfectamente en móviles, tablets y desktop
- **Animaciones Suaves**: Transiciones y efectos visuales agradables
- **Notificaciones**: Toast notifications para feedback inmediato
- **Drag & Drop Intuitivo**: Visual feedback durante el arrastre
- **Loading States**: Indicadores de carga para mejor experiencia
- **Validación de Formularios**: Feedback instantáneo en campos

## 🐛 Solución de Problemas

### Error: MongoDB no conecta

```bash
# Verifica que MongoDB esté corriendo
mongod --version
# Verifica la URI en .env
# Por defecto: mongodb://localhost:27017/kanban_db
```

### Error: CORS

```bash
# Verifica que el backend esté en el puerto 5000
# Verifica que el frontend apunte a http://localhost:5000/api
```

### Error: Token inválido

```bash
# Limpia localStorage y vuelve a iniciar sesión
# En la consola del navegador:
localStorage.clear()
```

## 📝 Scripts Disponibles

### Backend

```bash
npm start     # Inicia el servidor
npm run dev   # Inicia con nodemon (auto-reload)
```

### Frontend

```bash
npm start     # Inicia la aplicación en modo desarrollo
npm build     # Crea build de producción
npm test      # Ejecuta tests
```

## 🚀 Despliegue en Producción

### Backend

1. Configura variables de entorno en tu servidor
2. Usa un servicio de MongoDB en la nube (MongoDB Atlas)
3. Cambia `NODE_ENV=production`
4. Usa PM2 o similar para mantener el proceso activo

### Frontend

```bash
npm run build
# Sirve la carpeta build/ con un servidor web (nginx, Apache, etc.)
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto de demostración de aplicación Full Stack.

## 🙏 Agradecimientos

- React Beautiful DND por la excelente biblioteca de drag and drop
- La comunidad de React y Node.js por sus recursos

---

¡Disfruta gestionando tus proyectos con Kanban Board! 🎯
