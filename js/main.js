/**
 * Punto de entrada de la aplicación.
 * Capa de entrada: selección del DOM (una sola vez) y gestión del evento de envío.
 */

import { validarPublicacion } from "./validation/postValidator.js";

// ---------- Selección del DOM (referencias cacheadas, se reutilizan en todo el flujo) ----------

const elementos = {
  formulario: document.getElementById("form-publicacion"),
  campoTitulo: document.getElementById("campo-titulo"),
  campoContenido: document.getElementById("campo-contenido"),
  botonPublicar: document.getElementById("boton-publicar"),
  mensajeValidacion: document.getElementById("mensaje-validacion"),
  estadoCarga: document.getElementById("estado-carga"),
  resultado: document.getElementById("resultado"),
};

// ---------- Utilidades de mensajes (textContent: inserción segura, sin innerHTML) ----------

/**
 * Muestra un mensaje en la región indicada.
 * @param {HTMLElement} contenedor - Región del DOM donde mostrar el mensaje.
 * @param {string} texto - Texto a presentar.
 * @param {"error"|"exito"|"carga"} tipo - Variante visual del mensaje.
 */
function mostrarMensaje(contenedor, texto, tipo) {
  contenedor.textContent = texto;
  contenedor.classList.remove("mensaje--oculto", "mensaje--error", "mensaje--exito");
  contenedor.classList.add(`mensaje--${tipo}`);
}

/**
 * Oculta la región de mensajes de validación.
 * @param {HTMLElement} contenedor - Región del DOM a ocultar.
 */
function ocultarMensaje(contenedor) {
  contenedor.textContent = "";
  contenedor.classList.add("mensaje--oculto");
}

// ---------- Gestión del evento de envío ----------

/**
 * Maneja el envío del formulario: evita la recarga, valida los datos
 * y evita la petición HTTP si los datos no son válidos.
 * @param {Event} event - Evento submit del formulario.
 */
function manejarEnvio(event) {
  event.preventDefault();

  const datos = {
    titulo: elementos.campoTitulo.value,
    contenido: elementos.campoContenido.value,
  };

  const validacion = validarPublicacion(datos);

  if (!validacion.esValido) {
    // Une los errores (pueden ser dos) en un solo mensaje legible.
    mostrarMensaje(
      elementos.mensajeValidacion,
      validacion.errores.join(" "),
      "error"
    );
    return; // No se realiza ninguna petición HTTP con datos inválidos.
  }

  ocultarMensaje(elementos.mensajeValidacion);

  // En esta etapa solo se confirma que la validación pasó.
  // La petición HTTP se incorpora en la siguiente etapa del desarrollo.
  mostrarMensaje(
    elementos.mensajeValidacion,
    "Datos válidos. La publicación está lista para enviarse.",
    "exito"
  );
}

// Un único listener registrado una sola vez (evita registros duplicados).
elementos.formulario.addEventListener("submit", manejarEnvio);
