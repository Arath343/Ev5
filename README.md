# Evidencia 2: Ejercicios de creación y consumo de API

## 📋 Descripción

Este proyecto demuestra la **creación y consumo de APIs** implementando:

1. **API Backend**: Servidor Express.js que expone endpoints REST en formato JSON
2. **Cliente Frontend**: Aplicación React que consume la API usando `fetch()`
3. **Interfaz interactiva**: Panel de control para probar todos los endpoints
4. **Documentación completa**: Código comentado y ejemplos de uso

## 🎯 Objetivo

Crear una API básica funcional y un cliente JavaScript que demuestre:

- Creación de endpoints REST (GET, POST)
- Consumo de APIs con `fetch()`
- Manejo de respuestas JSON
- Gestión de errores y estados de carga
- Interfaz de usuario moderna y responsive

## 🏗️ Arquitectura del Proyecto

```
proyecto/
├── server/
│   └── index.js          # API Express.js
├── src/
│   ├── App.tsx          # Cliente React
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos
├── package.json         # Dependencias
└── README.md           # Documentación
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v16 o superior
- npm o yarn

### Pasos para ejecutar:

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar el proyecto completo**:
```bash
npm run dev
```

Esto iniciará automáticamente:
- **API Server**: http://localhost:3001
- **Cliente React**: http://localhost:5173

## 📡 Código de la API (server/index.js)

### Configuración del servidor:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
```

### Endpoints implementados:

#### 1. Saludo básico
```javascript
// GET /api/saludo
app.get('/api/saludo', (req, res) => {
  res.json({ 
    mensaje: '¡Hola desde Express!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});
```

#### 2. Obtener usuarios
```javascript
// GET /api/usuarios
app.get('/api/usuarios', (req, res) => {
  try {
    res.json({
      data: usuarios,
      total: usuarios.length,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      status: 'error'
    });
  }
});
```

#### 3. Crear usuario
```javascript
// POST /api/usuarios
app.post('/api/usuarios', (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    
    if (!nombre || !email || !edad) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre, email, edad',
        status: 'error'
      });
    }
    
    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre,
      email,
      edad: parseInt(edad)
    };
    
    usuarios.push(nuevoUsuario);
    
    res.status(201).json({
      data: nuevoUsuario,
      mensaje: 'Usuario creado exitosamente',
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      status: 'error'
    });
  }
});
```

## 💻 Código del Cliente (src/App.tsx)

### Función genérica para peticiones:

```javascript
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición');
    }
    
    setResponse(data);
    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

### Consumo de endpoints específicos:

```javascript
// GET request
const handleSaludo = () => fetchApi('/saludo');

const handleUsuarios = async () => {
  const data = await fetchApi('/usuarios');
  setUsuarios(data.data || []);
};

// POST request
const handleCrearUsuario = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await fetchApi('/usuarios', {
      method: 'POST',
      body: JSON.stringify(nuevoUsuario),
    });
    
    setNuevoUsuario({ nombre: '', email: '', edad: '' });
    handleUsuarios(); // Refrescar lista
  } catch (err) {
    // Error ya manejado en fetchApi
  }
};
```

## 🧪 Ejemplos de Uso

### 1. Probar endpoint de saludo:
```bash
curl http://localhost:3001/api/saludo
```

**Respuesta esperada:**
```json
{
  "mensaje": "¡Hola desde Express!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "success"
}
```

### 2. Obtener lista de usuarios:
```bash
curl http://localhost:3001/api/usuarios
```

### 3. Crear nuevo usuario:
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Pedro García","email":"pedro@email.com","edad":29}'
```

## 🔧 Características Técnicas

### Backend (Express.js):
- ✅ **CORS habilitado** para peticiones cross-origin
- ✅ **Middleware JSON** para parsing de requests
- ✅ **Manejo de errores** con try-catch
- ✅ **Validación de datos** en endpoints POST
- ✅ **Códigos HTTP apropiados** (200, 201, 400, 404, 500)
- ✅ **Base de datos simulada** en memoria

### Frontend (React + TypeScript):
- ✅ **Tipos TypeScript** para APIs y datos
- ✅ **Estados de carga** con spinners
- ✅ **Manejo de errores** con mensajes al usuario
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **Componentes reutilizables** y código limpio
- ✅ **Efectos visuales** con animaciones suaves

## 📊 Funcionalidades Implementadas

| Endpoint | Método | Funcionalidad | ✅ Estado |
|----------|--------|---------------|----------|
| `/api/saludo` | GET | Mensaje de saludo básico | ✅ |
| `/api/usuarios` | GET | Lista todos los usuarios | ✅ |
| `/api/usuarios/:id` | GET | Usuario específico por ID | ✅ |
| `/api/productos` | GET | Lista de productos | ✅ |
| `/api/usuarios` | POST | Crear nuevo usuario | ✅ |
| `/api/info` | GET | Información del servidor | ✅ |

## 🎨 Características de la Interfaz

- **Diseño moderno** con gradientes y efectos glass-morphism
- **Navegación por pestañas** para diferentes endpoints
- **Indicadores visuales** de estado (carga, éxito, error)
- **Formularios interactivos** para crear usuarios
- **Visualización JSON** formateada y coloreada
- **Responsive design** optimizado para móviles y desktop

## 🛠️ Tecnologías Utilizadas

### Backend:
- **Express.js** - Framework web para Node.js
- **CORS** - Middleware para peticiones cross-origin
- **Node.js** - Runtime de JavaScript

### Frontend:
- **React 18** - Biblioteca para interfaces de usuario
- **TypeScript** - JavaScript con tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **Lucide React** - Iconos SVG modernos
- **Vite** - Build tool y dev server

### Herramientas:
- **Nodemon** - Auto-restart del servidor
- **Concurrently** - Ejecutar múltiples comandos
- **ESLint** - Linter para código JavaScript/TypeScript

## 📝 Evaluación

### ✅ Criterios Cumplidos:

1. **API local funcional** - Servidor Express con múltiples endpoints
2. **Cliente implementado** - Aplicación React que consume la API
3. **Código documentado** - README completo y comentarios en código
4. **Prueba presentada** - Interfaz interactiva para probar endpoints

## 🚧 Extensiones Futuras

- [ ] Persistencia en base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación JWT
- [ ] Paginación en listados
- [ ] Filtros y búsquedas avanzadas
- [ ] Tests unitarios y de integración
- [ ] Deploy en producción

## 👨‍💻 Autor

Proyecto desarrollado como evidencia de aprendizaje en creación y consumo de APIs.

---

**Nota**: Este proyecto está diseñado con fines educativos y demuestra las mejores prácticas en desarrollo de APIs REST y consumo con JavaScript moderno.