/**
 * Capa de negocio: validación de la publicación.
 * Funciones puras, sin dependencia del DOM ni de la red.
 */

/** Longitud mínima aceptada para el título (caracteres, una vez recortado). */
const LONGITUD_MINIMA_TITULO = 3;

/** Longitud mínima aceptada para el contenido (caracteres, una vez recortado). */
const LONGITUD_MINIMA_CONTENIDO = 10;

/**
 * Valida un texto descartando vacíos y cadenas de solo espacios.
 * @param {string} texto - Valor crudo ingresado por el usuario.
 * @param {string} nombreCampo - Nombre legible para el mensaje de error.
 * @param {number} longitudMinima - Cantidad mínima de caracteres válidos.
 * @returns {string|null} Mensaje de error, o null si el valor es válido.
 */
function validarCampo(texto, nombreCampo, longitudMinima) {
  const valor = typeof texto === "string" ? texto.trim() : "";

  if (valor === "") {
    return `El campo "${nombreCampo}" no puede estar vacío ni contener solo espacios.`;
  }

  if (valor.length < longitudMinima) {
    return `El campo "${nombreCampo}" debe tener al menos ${longitudMinima} caracteres.`;
  }

  return null;
}

/**
 * Valora la publicación completa.
 * @param {{titulo: string, contenido: string}} datos - Datos crudos del formulario.
 * @returns {{esValido: boolean, errores: string[], titulo: string, contenido: string}}
 *          Resultado de la validación con los valores ya recortados (trim).
 */
export function validarPublicacion({ titulo, contenido }) {
  const errores = [];

  const errorTitulo = validarCampo(titulo, "Título", LONGITUD_MINIMA_TITULO);
  if (errorTitulo) errores.push(errorTitulo);

  const errorContenido = validarCampo(
    contenido,
    "Contenido",
    LONGITUD_MINIMA_CONTENIDO
  );
  if (errorContenido) errores.push(errorContenido);

  return {
    esValido: errores.length === 0,
    errores,
    titulo: typeof titulo === "string" ? titulo.trim() : "",
    contenido: typeof contenido === "string" ? contenido.trim() : "",
  };
}
