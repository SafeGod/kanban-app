# 🏗️ Arquitectura del Sistema - Kanban Board

## Visión General

La aplicación Kanban Board sigue una arquitectura **Full Stack** con separación clara entre frontend y backend, comunicándose a través de una API RESTful.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Frontend (Puerto 3000)           │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Components                                   │  │    │
│  │  │  - Login, Register, Dashboard, Board         │  │    │
│  │  │  - PrivateRoute (protección de rutas)        │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Context API                                  │  │    │
│  │  │  - AuthContext (gestión de autenticación)    │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Services                                     │  │    │
│  │  │  - API Service (axios, interceptors)         │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ (REST API)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVIDOR (Puerto 5000)                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Express.js Backend                        │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Routes                                       │  │    │
│  │  │  - /api/auth (autenticación)                 │  │    │
│  │  │  - /api/boards (tableros, columnas, tareas)  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Middleware                                   │  │    │
│  │  │  - JWT Authentication                        │  │    │
│  │  │  - CORS                                      │  │    │
│  │  │  - Express Validator                         │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Models (Mongoose)                           │  │    │
│  │  │  - User                                      │  │    │
│  │  │  - Board (con columnas y tareas embebidas)  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │              MongoDB (Puerto 27017)                │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Collections                                  │  │    │
│  │  │  - users                                     │  │    │
│  │  │  - boards                                    │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Tecnología**: React 18

**Responsabilidades**:
- Renderizar la interfaz de usuario
- Manejar interacciones del usuario
- Gestionar estado local y global (Context API)
- Comunicarse con el backend a través de API REST
- Implementar funcionalidad drag and drop

**Componentes Clave**:

```
src/
├── components/          # Componentes reutilizables
│   └── PrivateRoute.js # HOC para proteger rutas
├── context/            # Estado global
│   └── AuthContext.js  # Gestión de autenticación
├── pages/              # Páginas principales
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   └── Board.js        # Tablero Kanban con DnD
├── services/           # Lógica de negocio
│   └── api.js          # Cliente HTTP con interceptors
└── styles/             # Estilos CSS modulares
```

**Patrones de Diseño**:
- **Context API**: Para gestión de estado de autenticación
- **Higher-Order Components (HOC)**: PrivateRoute para protección de rutas
- **Service Layer**: Abstracción de llamadas API

### 2. Capa de Aplicación (Backend API)

**Tecnología**: Node.js + Express

**Responsabilidades**:
- Exponer endpoints RESTful
- Validar datos de entrada
- Autenticar y autorizar solicitudes
- Aplicar lógica de negocio
- Comunicarse con la base de datos

**Estructura**:

```
backend/
├── config/
│   └── database.js      # Configuración MongoDB
├── middleware/
│   └── auth.js          # Middleware JWT
├── models/
│   ├── User.js          # Esquema de usuario
│   └── Board.js         # Esquema de tablero
├── routes/
│   ├── auth.js          # Endpoints de autenticación
│   └── boards.js        # Endpoints de tableros
└── server.js            # Punto de entrada
```

**Patrones de Diseño**:
- **MVC (Modelo-Vista-Controlador)**: Separación de responsabilidades
- **Middleware Pattern**: Para autenticación, validación, etc.
- **Repository Pattern**: Mongoose como capa de abstracción de datos

### 3. Capa de Datos

**Tecnología**: MongoDB

**Responsabilidades**:
- Persistir datos
- Garantizar integridad de datos
- Optimizar consultas

**Esquema de Datos**:

```javascript
// Usuario
{
  _id: ObjectId,
  name: String,
  email: String (único),
  password: String (hasheado),
  createdAt: Date
}

// Tablero
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  columns: [
    {
      _id: ObjectId,
      name: String,
      order: Number
    }
  ],
  tasks: [
    {
      _id: ObjectId,
      title: String,
      description: String,
      columnId: ObjectId,
      order: Number,
      dueDate: Date,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Flujo de Autenticación

```
1. Usuario → POST /api/auth/register
   ↓
2. Backend valida datos
   ↓
3. Backend hashea contraseña (bcrypt)
   ↓
4. Backend guarda usuario en MongoDB
   ↓
5. Backend genera JWT token
   ↓
6. Backend retorna token + datos usuario
   ↓
7. Frontend guarda token en localStorage
   ↓
8. Frontend incluye token en header Authorization
   para todas las peticiones subsiguientes
   ↓
9. Middleware backend verifica token en cada petición
```

## Flujo de Drag and Drop

```
1. Usuario arrastra tarea
   ↓
2. react-beautiful-dnd captura evento
   ↓
3. Frontend actualiza UI optimísticamente
   ↓
4. Frontend envía PUT /api/boards/:id/tasks/:taskId/move
   ↓
5. Backend actualiza orden de tareas
   ↓
6. Backend guarda en MongoDB
   ↓
7. Backend retorna respuesta
   ↓
8. En caso de error, frontend revierte cambios
```

## Seguridad

### Frontend
- Validación de formularios en cliente
- Tokens JWT almacenados en localStorage
- Rutas protegidas con PrivateRoute
- Sanitización de entradas de usuario

### Backend
- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración configurable
- Middleware de autenticación en rutas protegidas
- Validación de datos con express-validator
- CORS configurado
- Headers de seguridad
- Verificación de propiedad de recursos

### Base de Datos
- Validaciones a nivel de esquema (Mongoose)
- Índices únicos en campos críticos (email)
- Conexiones seguras

## Escalabilidad

### Consideraciones Actuales
- Estructura de carpetas modular
- Separación de responsabilidades
- API RESTful stateless

### Mejoras Futuras
- **Caché**: Redis para sesiones y datos frecuentes
- **CDN**: Para assets estáticos
- **Load Balancer**: Para distribuir tráfico
- **Microservicios**: Separar autenticación, tableros, etc.
- **WebSockets**: Para actualizaciones en tiempo real
- **Message Queue**: Para operaciones asíncronas
- **Containerización**: Docker para despliegue

## Manejo de Errores

### Frontend
- Try-catch en llamadas async
- Toast notifications para feedback
- Estados de carga y error
- Fallback UI para errores graves

### Backend
- Middleware global de manejo de errores
- Respuestas consistentes:
  ```json
  {
    "success": false,
    "message": "Descripción del error",
    "errors": [] // opcional, para validaciones
  }
  ```
- Logging de errores en consola
- Códigos HTTP apropiados

## Testing (Para Implementación Futura)

### Frontend
- Jest para pruebas unitarias
- React Testing Library para componentes
- Cypress para pruebas E2E

### Backend
- Jest para pruebas unitarias
- Supertest para pruebas de API
- MongoDB Memory Server para tests

## Performance

### Optimizaciones Actuales
- Minimización de re-renders (React)
- Debouncing en búsquedas
- Lazy loading de componentes
- Índices en MongoDB

### Optimizaciones Futuras
- Code splitting
- Server-Side Rendering (SSR)
- Paginación de tableros/tareas
- Compresión gzip
- Optimización de imágenes

## Deployment

### Opciones de Despliegue

**Frontend**:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Backend**:
- Heroku
- AWS EC2 / ECS
- DigitalOcean
- Render

**Base de Datos**:
- MongoDB Atlas
- AWS DocumentDB
- Self-hosted MongoDB

## Monitoreo (Futuro)

- **Logs**: Winston, Morgan
- **APM**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel

## Conclusión

Esta arquitectura proporciona una base sólida para una aplicación de gestión de tareas escalable y mantenible. La separación clara de responsabilidades facilita el desarrollo, testing y deployment independiente de cada capa.
