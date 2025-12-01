import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Sesión expirada, redirigiendo a login...');
      // Aquí puedes redirigir al login si quieres
    }
    return Promise.reject(error);
  }
);

// Servicio de Productos (para Ventaproducto.jsx)
export const productoService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      // Datos de respaldo por si el backend falla
      return [
        { id: 1, nombre: 'Fairytail Volumen', precio: 150, categoria: 'Manga', stock: 15, imagen_url: 'https://m.media-amazon.com/images/I/81EIdomF4FL._AC_UF1000,1000_QL80_.jpg' },
        { id: 2, nombre: 'Heartstopper', precio: 180, categoria: 'Comic', stock: 25, imagen_url: 'https://encantalibros.com/wp-content/uploads/2020/12/9789877475876.jpg' }
      ];
    }
  },

  // Obtener por categoría
  getByCategory: async (categoria) => {
    try {
      const response = await api.get(`/productos/categoria/${categoria}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo productos de ${categoria}:`, error);
      return [];
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      return null;
    }
  },

  // Crear producto (para admin)
  create: async (productoData) => {
    try {
      const response = await api.post('/productos', productoData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  },

  // Actualizar producto (para admin)
  update: async (id, productoData) => {
    try {
      const response = await api.put(`/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw error;
    }
  },

  // Eliminar producto (eliminación lógica)
  delete: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw error;
    }
  }
};

// Servicio de Autenticación (para Login/Registro)
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Aquí podrías llamar a una API de logout si la tienes
    return Promise.resolve();
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Servicio de Carrito (ACTUALIZADO para usar backend)
export const carritoService = {
  // Obtener carrito desde la base de datos
  getCart: async () => {
    try {
      const response = await api.get('/carrito');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo carrito:', error);
      return [];
    }
  },

  // Agregar al carrito (guarda en BD)
  addToCart: async (productoId, cantidad = 1) => {
    try {
      const response = await api.post('/carrito', { productoId, cantidad });
      return response.data;
    } catch (error) {
      console.error('❌ Error agregando al carrito:', error);
      throw error;
    }
  },

  // Actualizar cantidad (guarda en BD)
  updateQuantity: async (itemId, cantidad) => {
    try {
      const response = await api.put(`/carrito/${itemId}`, { cantidad });
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando cantidad:', error);
      throw error;
    }
  },

  // Eliminar del carrito (elimina de BD)
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/carrito/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando del carrito:', error);
      throw error;
    }
  },

  // Vaciar carrito (limpia BD)
  clearCart: async () => {
    try {
      const response = await api.delete('/carrito');
      return response.data;
    } catch (error) {
      console.error('❌ Error vaciando carrito:', error);
      throw error;
    }
  }
};

// Servicio de Comentarios (para Comentarios.jsx)
export const comentarioService = {
  // Obtener comentarios de un producto
  getByProducto: async (productoId) => {
    try {
      const response = await api.get(`/comentarios/producto/${productoId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo comentarios de producto ${productoId}:`, error);
      return [];
    }
  },

  // Crear comentario
  create: async (comentarioData) => {
    try {
      const response = await api.post('/comentarios', comentarioData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando comentario:', error);
      throw error;
    }
  }
};

// Servicio de Logs (REQUERIDO en tu proyecto)
export const logService = {
  // Obtener logs
  getLogs: async () => {
    try {
      const response = await api.get('/logs');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo logs:', error);
      return [];
    }
  },

  // Crear log (desde frontend)
  createLog: async (logData) => {
    try {
      const response = await api.post('/logs', logData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando log:', error);
      // No lanzar error para que no afecte la experiencia del usuario
      return null;
    }
  }
};

// Función para crear log desde cualquier componente
export const logEvent = (event_type, detalles = {}) => {
  const user = authService.getCurrentUser();
  
  const logData = {
    usuario_id: user?.id || null,
    event_type,
    ip_address: '192.168.1.100', // Esto debería obtenerse del frontend
    browser: navigator.userAgent,
    user_agent: navigator.userAgent,
    ...detalles
  };

  // Enviar de forma asíncrona (no bloquear)
  logService.createLog(logData).catch(() => {
    // Silenciar error, no es crítico
  });
};

export default api;