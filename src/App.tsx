import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Users, 
  Package, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Code,
  Globe
} from 'lucide-react';

// Tipos TypeScript
interface ApiResponse {
  data?: any;
  mensaje?: string;
  error?: string;
  status: string;
  timestamp?: string;
  total?: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('saludo');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estados para el formulario de crear usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    edad: ''
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  // Función genérica para hacer peticiones fetch
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

  // Handlers para diferentes endpoints
  const handleSaludo = () => fetchApi('/saludo');
  
  const handleUsuarios = async () => {
    const data = await fetchApi('/usuarios');
    setUsuarios(data.data || []);
  };
  
  const handleProductos = async () => {
    const data = await fetchApi('/productos');
    setProductos(data.data || []);
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.edad) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await fetchApi('/usuarios', {
        method: 'POST',
        body: JSON.stringify(nuevoUsuario),
      });
      
      // Limpiar formulario y actualizar lista
      setNuevoUsuario({ nombre: '', email: '', edad: '' });
      handleUsuarios(); // Refrescar lista de usuarios
    } catch (err) {
      // Error ya manejado en fetchApi
    }
  };

  const handleInfoServidor = () => fetchApi('/info');

  // Auto-ejecutar saludo al cargar
  useEffect(() => {
    handleSaludo();
  }, []);

  const tabs = [
    { id: 'saludo', label: 'Saludo', icon: Globe },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'crear', label: 'Crear Usuario', icon: Send },
    { id: 'info', label: 'Info Servidor', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                API Creation & Consumption
              </h1>
              <p className="text-gray-600">
                Demostración de creación y consumo de APIs con Express.js y React
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de Control */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                Endpoints Disponibles
              </h2>
              
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Estado del servidor */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    Servidor: http://localhost:3001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              {/* Contenido dinámico según tab activo */}
              {activeTab === 'saludo' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Endpoint de Saludo
                    </h3>
                    <button
                      onClick={handleSaludo}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Probar GET /api/saludo
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <code className="text-sm text-gray-700">
                      GET http://localhost:3001/api/saludo
                    </code>
                  </div>
                </div>
              )}

              {activeTab === 'usuarios' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Lista de Usuarios
                    </h3>
                    <button
                      onClick={handleUsuarios}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                      Cargar Usuarios
                    </button>
                  </div>

                  {usuarios.length > 0 && (
                    <div className="grid gap-4 mb-6">
                      {usuarios.map((usuario) => (
                        <div key={usuario.id} className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800">{usuario.nombre}</h4>
                          <p className="text-gray-600">{usuario.email}</p>
                          <p className="text-sm text-gray-500">{usuario.edad} años</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'productos' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Catálogo de Productos
                    </h3>
                    <button
                      onClick={handleProductos}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                      Cargar Productos
                    </button>
                  </div>

                  {productos.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {productos.map((producto) => (
                        <div key={producto.id} className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800">{producto.nombre}</h4>
                          <p className="text-green-600 font-bold">${producto.precio}</p>
                          <p className="text-sm text-gray-500">{producto.categoria}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'crear' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Crear Nuevo Usuario
                  </h3>
                  
                  <form onSubmit={handleCrearUsuario} className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa el nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="usuario@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edad
                      </label>
                      <input
                        type="number"
                        value={nuevoUsuario.edad}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, edad: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Crear Usuario
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Información del Servidor
                    </h3>
                    <button
                      onClick={handleInfoServidor}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Server className="w-4 h-4" />
                      )}
                      Obtener Info
                    </button>
                  </div>
                </div>
              )}

              {/* Respuesta de la API */}
              {(response || error) && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    {error ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    Respuesta de la API
                  </h4>
                  
                  <div className={`rounded-lg p-4 ${
                    error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <pre className="text-sm overflow-x-auto">
                      {error ? (
                        <span className="text-red-700">{error}</span>
                      ) : (
                        <span className="text-green-700">
                          {JSON.stringify(response, null, 2)}
                        </span>
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;