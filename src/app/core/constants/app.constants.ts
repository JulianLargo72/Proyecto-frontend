/**
 * Constantes de configuración de la aplicación
 * Centraliza URLs, configuraciones y valores constantes
 */

/**
 * URLs de datos JSON
 */
export const API_ENDPOINTS = {
  productos: '/data/productos.json',
  accesorios: '/data/accesorios.json',
  usuarios: '/data/usuarios.json'
} as const;

/**
 * Mensajes de error estándar
 */
export const ERROR_MESSAGES = {
  loadProducts: 'Error al cargar productos',
  loadAccessories: 'Error al cargar accesorios',
  loadUsers: 'Error al cargar usuarios',
  notFound: 'No encontrado',
  generic: 'Ha ocurrido un error'
} as const;

/**
 * Configuración de caché
 */
export const CACHE_CONFIG = {
  enableCache: true,
  cacheTimeout: 300000 // 5 minutos en milisegundos
} as const;

/**
 * Rutas de la aplicación
 */
export const APP_ROUTES = {
  home: '/home',
  catalogo: '/catalogo',
  producto: '/producto',
  accesorios: '/accesorios',
  accesorio: '/accesorio',
  carrito: '/carrito',
  checkout: '/checkout',
  soporte: '/soporte',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard'
} as const;
