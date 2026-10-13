/**
 * Capa de control: orquesta el flujo completo de una publicación.
 * Valida, gestiona los estados de la interfaz, invoca la capa de datos
 * y asegura el restablecimiento de los controles incluso ante errores.
 */

import { validarPublicacion } from "../validation/postValidator.js";
import { enviarPublicacion } from "../api/apiClient.js";
import {
  mostrarMensaje,
  ocultarMensaje,
  limpiarSesionAnterior,
  establecerCarga,
  mostrarResultado,
  describirError,
} from "../ui/domView.js";

/**
 * Ejecuta el flujo de publicación completo.
 *
 * Secuencia:
 * 1. Valida los datos; si son inválidos muestra los errores y NO envía nada.
 * 2. Activa el indicador de carga y deshabilita el botón (evita envíos repetidos).
 * 3. Envía la petición y procesa la respuesta asíncrona.
 * 4. Distingue errores de conexión, HTTP y de procesamiento del JSON.
 * 5. Restablece los controles en finally, incluso si la operación falló.
 *
 * @param {{titulo: string, contenido: string}} datos - Valores crudos del formulario.
 * @param {object} elementos - Referencias cacheadas del DOM.
 */
export async function publicarMensaje(datos, elementos) {
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

  limpiarSesionAnterior(elementos);
  establecerCarga(elementos, true);

  try {
    const respuesta = await enviarPublicacion(validacion);
    mostrarResultado(elementos.resultado, respuesta);
    mostrarMensaje(
      elementos.mensajeValidacion,
      "Publicación creada correctamente.",
      "exito"
    );
  } catch (error) {
    // La causa ya viene categorizada (conexión / http / respuesta).
    console.error("Error al publicar el mensaje:", error);
    mostrarMensaje(
      elementos.mensajeValidacion,
      describirError(error),
      "error"
    );
  } finally {
    // Se restablece SIEMPRE, incluso si la operación falló,
    // para permitir nuevos intentos.
    establecerCarga(elementos, false);
  }
}
