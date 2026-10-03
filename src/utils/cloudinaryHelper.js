/**
 * Optimiza una URL de Cloudinary agregando transformaciones on-the-fly:
 * - w_{width}: redimensiona al ancho pedido (nunca sirve más resolución de la que se ve)
 * - q_auto: comprime automáticamente sin pérdida visible
 * - f_auto: sirve WebP/AVIF si el navegador lo soporta (mucho más liviano)
 *
 * Si la URL no es de Cloudinary (ej: quedó algo viejo, o en el futuro migrás a R2),
 * la devuelve tal cual, sin romper nada.
 *
 * @param {string} url - URL original de Cloudinary
 * @param {number} width - ancho deseado en px (usá el tamaño real en pantalla, no más)
 * @returns {string} URL optimizada
 */
export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transformacion = `w_${width},q_auto,f_auto`;

  // Si ya tiene transformaciones puestas a mano, no las duplicamos
  if (url.includes(`/upload/${transformacion}`)) return url;

  return url.replace('/upload/', `/upload/${transformacion}/`);
};