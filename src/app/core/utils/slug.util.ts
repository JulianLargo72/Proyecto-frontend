/**
 * Utilidad para generar slugs URL-friendly
 * Centraliza la lógica de generación de slugs para evitar duplicación
 */
export class SlugUtil {
  /**
   * Genera un slug a partir de un texto
   * @param texto - Texto a convertir en slug
   * @returns Slug en formato URL-friendly
   * 
   * @example
   * SlugUtil.generar('Samsung Galaxy S24') => 'samsung-galaxy-s24'
   * SlugUtil.generar('Protección 100%') => 'proteccion-100'
   */
  static generar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD') // Descomponer caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio/fin
  }

  /**
   * Valida si un slug tiene el formato correcto
   * @param slug - Slug a validar
   * @returns true si el slug es válido
   */
  static esValido(slug: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
  }
}
