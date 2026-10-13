/**
 * Capa de presentación: toda la manipulación del DOM de resultados y mensajes.
 * Usa textContent y createElement, nunca innerHTML, para presentar
 * datos externos de forma segura (prevención de inyección de contenido).
 */

/**
 * Muestra un mensaje en la región indicada.
 * @param {HTMLElement} contenedor - Región del DOM donde mostrar el mensaje.
 * @param {string} texto - Texto a presentar.
 * @param {"error"|"exito"|"carga"} tipo - Variante visual del mensaje.
 */
export function mostrarMensaje(contenedor, texto, tipo) {
  contenedor.textContent = texto;
  contenedor.classList.remove("mensaje--oculto", "mensaje--error", "mensaje--exito");
  contenedor.classList.add(`mensaje--${tipo}`);
}

/**
 * Oculta una región de mensajes y limpia su contenido.
 * @param {HTMLElement} contenedor - Región del DOM a ocultar.
 */
export function ocultarMensaje(contenedor) {
  contenedor.textContent = "";
  contenedor.classList.add("mensaje--oculto");
}

/**
 * Activa o desactiva el estado de carga de la publicación.
 * Muestra el indicador, controla aria-busy y deshabilita el botón
 * para evitar envíos repetidos mientras la petición está en curso.
 * @param {object} elementos - Referencias cacheadas del DOM.
 * @param {boolean} cargando - true para activar, false para restablecer.
 */
export function establecerCarga({ botonPublicar, estadoCarga }, cargando) {
  botonPublicar.disabled = cargando;
  estadoCarga.setAttribute("aria-busy", String(cargando));

  if (cargando) {
    mostrarMensaje(estadoCarga, "Publicando mensaje...", "carga");
  } else {
    ocultarMensaje(estadoCarga);
  }
}

/**
 * Limpia los resultados y mensajes de una sesión anterior.
 * @param {object} elementos - Referencias cacheadas del DOM.
 */
export function limpiarSesionAnterior({ mensajeValidacion, resultado }) {
  ocultarMensaje(mensajeValidacion);
  ocultarMensaje(resultado);
}

/**
 * Muestra la respuesta devuelto por la API en la región de resultados.
 * Construye el contenido con createElement y textContent (inserción segura).
 * @param {HTMLElement} contenedor - Región de resultados del DOM.
 * @param {object} respuesta - Objeto devuelto por la API.
 */
export function mostrarResultado(contenedor, respuesta) {
  contenedor.replaceChildren();

  const titulo = document.createElement("h2");
  titulo.textContent = "Publicación enviada";

  const lista = document.createElement("dl");

  const campos = [
    ["ID asignado", respuesta.id],
    ["Título", respuesta.title],
    ["Contenido", respuesta.body],
    ["ID de autor", respuesta.userId],
  ];

  for (const [etiqueta, valor] of campos) {
    const termino = document.createElement("dt");
    termino.textContent = etiqueta;

    const descripcion = document.createElement("dd");
    descripcion.textContent = String(valor ?? "(sin valor)");

    lista.append(termino, descripcion);
  }

  contenedor.append(titulo, lista);
  contenedor.classList.remove("mensaje--oculto");
}

/**
 * Traduce un error del flujo en un mensaje comprensible para el usuario,
 * diferenciando la causa cuando está categorizada.
 * @param {Error} error - Error capturado en el flujo de envío.
 * @returns {string} Mensaje apto para mostrar en la interfaz.
 */
export function describirError(error) {
  return error?.message || "Ocurrió un error inesperado al publicar el mensaje.";
}
