// server/index.js - API Server usando Express.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos simulada
const usuarios = [
  { id: 1, nombre: 'Ana García', email: 'ana@email.com', edad: 28 },
  { id: 2, nombre: 'Carlos López', email: 'carlos@email.com', edad: 34 },
  { id: 3, nombre: 'María Rodríguez', email: 'maria@email.com', edad: 26 },
  { id: 4, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 31 }
];

const productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, categoria: 'Electrónicos' },
  { id: 2, nombre: 'Smartphone', precio: 800, categoria: 'Electrónicos' },
  { id: 3, nombre: 'Escritorio', precio: 300, categoria: 'Muebles' },
  { id: 4, nombre: 'Silla ergonómica', precio: 250, categoria: 'Muebles' }
];

// Ruta raíz - Página de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 API Express.js funcionando correctamente',
    version: '1.0.0',
    endpoints_disponibles: [
      'GET /api/saludo - Mensaje de saludo',
      'GET /api/usuarios - Lista de usuarios',
      'GET /api/usuarios/:id - Usuario específico',
      'GET /api/productos - Lista de productos',
      'POST /api/usuarios - Crear usuario',
      'GET /api/info - Información del servidor'
    ],
    instrucciones: 'Usa la aplicación React en http://localhost:5173 para interactuar con la API',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Rutas de la API

// Endpoint de saludo básico
app.get('/api/saludo', (req, res) => {
  res.json({ 
    mensaje: '¡Hola desde Express!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Obtener todos los usuarios
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

// Obtener usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        status: 'error'
      });
    }
    
    res.json({
      data: usuario,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      status: 'error'
    });
  }
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  try {
    // Simular filtrado por categoría si se proporciona
    const categoria = req.query.categoria;
    let productosFiltrados = productos;
    
    if (categoria) {
      productosFiltrados = productos.filter(p => 
        p.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }
    
    res.json({
      data: productosFiltrados,
      total: productosFiltrados.length,
      filtro: categoria || 'ninguno',
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor',
      status: 'error'
    });
  }
});

// Crear nuevo usuario (POST)
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

// Endpoint de información del servidor
app.get('/api/info', (req, res) => {
  res.json({
    servidor: 'Express.js API',
    version: '1.0.0',
    endpoints: [
      'GET /api/saludo',
      'GET /api/usuarios',
      'GET /api/usuarios/:id',
      'GET /api/productos',
      'POST /api/usuarios'
    ],
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Middleware para rutas no encontradas (debe ir al final)
app.use('*', (req, res) => {
  res.status(404).json({
    error: `Endpoint no encontrado: ${req.originalUrl}`,
    endpoints_disponibles: [
      'GET /',
      'GET /api/saludo',
      'GET /api/usuarios',
      'GET /api/usuarios/:id',
      'GET /api/productos',
      'POST /api/usuarios',
      'GET /api/info'
    ],
    status: 'error'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/api/saludo`);
  console.log(`   GET  http://localhost:${PORT}/api/usuarios`);
  console.log(`   GET  http://localhost:${PORT}/api/productos`);
  console.log(`   POST http://localhost:${PORT}/api/usuarios`);
  console.log(`   GET  http://localhost:${PORT}/api/info`);
  console.log(`\n💡 Usa la aplicación React en http://localhost:5173 para interactuar con la API`);
});

export default app;