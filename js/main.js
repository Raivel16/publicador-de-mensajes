/**
 * Punto de entrada de la aplicación.
 * Capa de entrada: selecciona el DOM una sola vez, registra un único
 * listener del evento de envío y delega el flujo en el controlador.
 */

import { publicarMensaje } from "./controller/postController.js";

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

// ---------- Gestión del evento de envío ----------

/**
 * Maneja el envío del formulario: evita la recarga de la página
 * y delega el procesamiento en el controlador.
 * @param {Event} event - Evento submit del formulario.
 */
async function manejarEnvio(event) {
  event.preventDefault();

  const datos = {
    titulo: elementos.campoTitulo.value,
    contenido: elementos.campoContenido.value,
  };

  await publicarMensaje(datos, elementos);
}

// Un único listener registrado una sola vez (evita registros duplicados).
elementos.formulario.addEventListener("submit", manejarEnvio);
