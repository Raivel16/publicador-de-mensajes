/**
 * Capa de datos: comunicación con la API REST.
 * Encapsula la configuración de la petición HTTP y el procesamiento
 * de la respuesta, diferenciando los distintos tipos de error.
 */

/** URL del recurso de publicaciones de la API de pruebas. */
const URL_API = "https://jsonplaceholder.typicode.com/posts";

/** Identificador del autor simulado (requerido por la API de destino). */
const ID_AUTOR = 1;

/**
 * Error de negocio que permite clasificar la causa del fallo
 * para mostrar un mensaje comprensible al usuario.
 */
export class ErrorPublicacion extends Error {
  /**
   * @param {string} mensaje - Mensaje apto para mostrar en la interfaz.
   * @param {"conexion"|"http"|"respuesta"} tipo - Categoría del fallo.
   */
  constructor(mensaje, tipo) {
    super(mensaje);
    this.name = "ErrorPublicacion";
    this.tipo = tipo;
  }
}

/**
 * Construye el objeto de publicación con los datos enviados a la API.
 * Solo incluye los campos que la API espera (sin propiedades innecesarias).
 * @param {{titulo: string, contenido: string}} datos - Datos ya validados.
 * @returns {{userId: number, title: string, body: string}} Cuerpo JSON a enviar.
 */
export function construirPublicacion({ titulo, contenido }) {
  return {
    userId: ID_AUTOR,
    title: titulo,
    body: contenido,
  };
}

/**
 * Envía la publicación a la API mediante una petición HTTP POST
 * y devuelve la respuesta interpretada como JSON.
 *
 * - Los errores de conexión (fetch rechazado) se convierten en ErrorPublicacion.
 * - Las respuestas HTTP no satisfactorias (!response.ok) se detectan con el estado.
 * - Los fallos al interpretar el JSON de la respuesta también se capturan.
 *
 * @param {{titulo: string, contenido: string}} datos - Datos ya validados.
 * @returns {Promise<object>} Objeto devuelto por la API.
 * @throws {ErrorPublicacion} Cuando falla la conexión, la respuesta HTTP o el JSON.
 */
export async function enviarPublicacion(datos) {
  const publicacion = construirPublicacion(datos);

  let respuesta;

  try {
    respuesta = await fetch(URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(publicacion),
    });
  } catch (errorDeRed) {
    // fetch rechaza la promesa ante fallos de red/conexión.
    console.error("Fallo de conexión con la API:", errorDeRed);
    throw new ErrorPublicacion(
      "No se pudo conectar con el servidor. Verificá tu conexión e intentá nuevamente.",
      "conexion"
    );
  }

  // Importante: fetch NO rechaza la promesa ante errores HTTP (404, 500, etc.),
  // por eso el estado debe comprobarse explícitamente con response.ok.
  if (!respuesta.ok) {
    throw new ErrorPublicacion(
      `El servidor respondió con un error HTTP ${respuesta.status} (${respuesta.statusText}).`,
      "http"
    );
  }

  try {
    return await respuesta.json();
  } catch (errorDeJson) {
    // Ocurre si el cuerpo de la respuesta no contiene JSON válido.
    console.error("Respuesta con JSON inválido:", errorDeJson);
    throw new ErrorPublicacion(
      "La respuesta del servidor no pudo interpretarse como JSON.",
      "respuesta"
    );
  }
}
