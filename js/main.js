/**
 * Punto de entrada de la aplicación.
 * Capa de entrada: selección del DOM (una sola vez) y gestión del evento de envío.
 */

import { validarPublicacion } from "./validation/postValidator.js";
import { enviarPublicacion } from "./api/apiClient.js";

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

// ---------- Estados de carga y controles ----------

/**
 * Activa el estado de carga: muestra el indicador, deshabilita el botón
 * y oculta resultados anteriores para evitar confusiones.
 * @param {boolean} cargando - true para activar, false para restablecer.
 */
function establecerCarga(cargando) {
  elementos.botonPublicar.disabled = cargando;
  elementos.estadoCarga.setAttribute("aria-busy", String(cargando));

  if (cargando) {
    mostrarMensaje(elementos.estadoCarga, "Publicando mensaje...", "carga");
    ocultarMensaje(elementos.resultado);
  } else {
    ocultarMensaje(elementos.estadoCarga);
  }
}

// ---------- Presentación del resultado ----------

/**
 * Muestra la respuesta devuelta por la API en la región de resultados.
 * Se usa textContent para presentar los datos externos de forma segura.
 * @param {object} respuesta - Objeto devuelto por la API.
 */
function mostrarResultado(respuesta) {
  elementos.resultado.replaceChildren();

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

  elementos.resultado.append(titulo, lista);
  elementos.resultado.classList.remove("mensaje--oculto");
}

// ---------- Gestión del evento de envío ----------

/**
 * Maneja el envío del formulario: evita la recarga, valida los datos,
 * envía la petición HTTP y procesa la respuesta asíncrona.
 * @param {Event} event - Evento submit del formulario.
 */
async function manejarEnvio(event) {
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
  establecerCarga(true);

  try {
    const respuesta = await enviarPublicacion(validacion);
    mostrarResultado(respuesta);
    mostrarMensaje(
      elementos.mensajeValidacion,
      "Publicación creada correctamente.",
      "exito"
    );
  } catch (error) {
    // Distingue la causa para ofrecer un mensaje comprensible.
    mostrarMensaje(
      elementos.mensajeValidacion,
      error.message || "Ocurrió un error inesperado al publicar.",
      "error"
    );
  } finally {
    // Se restablece SIEMPRE, incluso si la operación falló.
    establecerCarga(false);
  }
}

// Un único listener registrado una sola vez (evita registros duplicados).
elementos.formulario.addEventListener("submit", manejarEnvio);
