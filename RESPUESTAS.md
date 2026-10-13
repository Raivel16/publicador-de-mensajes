# Banco de 30 preguntas — respuestas breves

Respuestas del banco de preguntas de la demostración, referenciadas al código de la miniaplicación.

---

## A. HTML y manipulación del DOM

**1. ¿Qué función cumple el formulario HTML y qué ventajas ofrece frente a botones y campos independientes?**
El `<form>` agrupa los campos y el botón de envío y unifica su comportamiento: al presionar Enter en un campo o hacer clic en el botón se dispara un único evento `submit` con un `Event` que contiene toda la información del envío. Con botones independientes habría que coordinar cada interacción a mano y reconstruir ese comportamiento.

**2. ¿Qué diferencia existe entre `querySelector()` y `getElementById()`? ¿Cuál utilizaste y por qué?**
`getElementById()` solo busca por `id` y es la vía más rápida (acceso directo al índice de identificadores). `querySelector()` acepta cualquier selector CSS (clases, atributos, combinaciones) y devuelve el primer elemento que coincida. Usé `getElementById()` porque todos los elementos están identificados con `id` únicos: es más directo y eficiente.

**3. ¿Cómo se obtiene el contenido ingresado por el usuario en los campos del título y del mensaje?**
Leyendo la propiedad `value` del elemento: `elementos.campoTitulo.value` y `elementos.campoContenido.value` (en `js/main.js`, dentro de `manejarEnvio`).

**4. ¿Qué función cumple `addEventListener()`? ¿Qué evento utilizaste para detectar el envío del formulario?**
Registra una función (handler) que se ejecuta cuando ocurre un evento sobre el elemento, sin sobrescribir otros manejadores. Utilicé el evento `submit` sobre el `<form>`: `elementos.formulario.addEventListener("submit", manejarEnvio)` (en `js/main.js`).

**5. ¿Por qué se recomienda `textContent` en lugar de `innerHTML`?**
`textContent` inserta el valor como texto literal; el navegador nunca lo interpreta como marcado HTML. `innerHTML` analiza la cadena como HTML, por lo que un dato externo (por ejemplo, un título devuelto por la API con `<img onerror=...>`) podría inyectar scripts o atributos maliciosos (XSS). Por eso toda la presentación de datos externos usa `textContent` (en `js/ui/domView.js`).

**6. ¿Cómo actualiza JavaScript el DOM para mostrar un mensaje de éxito o error sin recargar la página?**
Obteniendo la referencia del contenedor y modificando su contenido y sus clases con JS: `contenedor.textContent = texto` y `contenedor.classList.add("mensaje--exito")`. El navegador solo vuelve a pintar ese nodo, no la página completa (en `js/ui/domView.js`, `mostrarMensaje`).

---

## B. JavaScript asíncrono y promesas

**7. ¿Qué significa que una operación sea asíncrona? Identifica una en tu aplicación.**
Que puede tardar tiempo sin bloquear el hilo de ejecución: el código continúa corriendo y el resultado se entrega después mediante una promesa o callback. En nuestra app, la llamada `fetch()` a la API de JSONPlaceholder es asíncrona: mientras espera la respuesta, la interfaz permanece usable (y mostramos el indicador de carga).

**8. ¿Qué es una promesa y qué relación tiene con `fetch()`?**
Una promesa es un objeto que representa un valor futuro: nace *pending* y termina en *fulfilled* (con un valor) o *rejected* (con un error). `fetch()` devuelve exactamente una promesa que se resuelve con el objeto `Response` cuando llega la cabecera de la respuesta del servidor.

**9. ¿Qué diferencia existe entre `async/await` y `.then()` / `.catch()`?**
Ambos consumen promesas. `.then()`/`.catch()` encadena callbacks (estilo funcional), mientras que `async/await` permite escribir y leer el flujo de forma secuencial, como si fuera síncrono, manteniendo la ventaja de la asincronía. Elegimos `async/await` porque el flujo de publicación es lineal (validar → enviar → verificar → mostrar) y se lee más claro, sobre todo con `try/catch`.

**10. ¿Qué función cumple la palabra clave `async` y qué tipo de valor devuelve esa función?**
`async` declara que una función trabajará con promesas y hace que su cuerpo se ejecute de forma asíncrona. Siempre devuelve una promesa: si retornás un valor simple, JavaScript lo envuelve automáticamente en una promesa resuelta con ese valor; si lanzás un error, devuelve una promesa rechazada.

**11. ¿Qué función cumple `await` cuando se utiliza para esperar la respuesta de `fetch()`?**
Pausa la ejecución de la función `async` en ese punto hasta que la promesa se resuelva, devolviendo su valor (el objeto `Response`) sin bloquear el hilo principal. La promesa rechazada se convierte en una excepción que puede capturarse con `try/catch`.

**12. ¿Qué ocurriría si se eliminara `await` delante de `response.json()`?**
`response.json()` también devuelve una promesa, no los datos. Sin `await`, la variable recibiría una promesa pendiente y al intentar acceder a `respuesta.title` obtendríamos `undefined` (las promesas no tienen esas propiedades), en lugar de los datos reales.

---

## C. Fetch API y peticiones HTTP

**13. ¿Qué es la Fetch API y para qué se utiliza en la miniaplicación?**
Es una API nativa del navegador para realizar peticiones HTTP y manejar sus respuestas con promesas. En la app se usa para enviar la publicación a `https://jsonplaceholder.typicode.com/posts` mediante una petición POST con `fetch()` (en `js/api/apiClient.js`).

**14. ¿Qué diferencia existe entre una petición GET y una petición POST? ¿Por qué se utiliza POST?**
GET solicita datos al servidor y no debe modificar su estado (es idempolente y seguro); POST envía datos al servidor para crear un recurso o provocar un cambio de estado. Se usa POST porque estamos *creando* una publicación: llevamos título y contenido en el cuerpo de la petición.

**15. ¿Qué función cumple el encabezado `Content-Type: application/json`?**
Informa al servidor que el cuerpo de la petición está serializado en formato JSON, para que lo parsee correctamente. Sin ese encabezado, muchas APIs no interpretarían el cuerpo como JSON y responderían con un 4xx.

**16. ¿Por qué se utiliza `JSON.stringify()` en el cuerpo de la petición? ¿Qué recibe y qué devuelve?**
Porque `fetch` transmite el cuerpo como texto (bytes), no como objetos. `JSON.stringify()` recibe un objeto JavaScript y devuelve su representación como cadena JSON válida (por ejemplo, `'{"title":"Hola","body":"Mundo","userId":1}'`), lista para enviarse.

**17. ¿Qué información contiene el objeto de configuración que se entrega como segundo argumento a `fetch()`?**
Describe la petición: `method` (POST), `headers` (cabeceras como `Content-Type`), `body` (el cuerpo serializado), y opcionalmente `mode`, `credentials` o `cache`. En nuestro caso: `{ method: "POST", headers: {...}, body: JSON.stringify(...) }`.

**18. ¿Qué función cumple `response.json()`? ¿En qué se diferencia de `JSON.stringify()`?**
`response.json()` lee el cuerpo de la respuesta y lo **parsea** de JSON a objeto JavaScript (devuelve una promesa con ese objeto). `JSON.stringify()` hace lo contrario: convierte un objeto JavaScript en una cadena JSON. Uno deserializa (respuesta), el otro serializa (petición).

---

## D. Manejo de respuestas y errores

**19. ¿Qué representa la propiedad `response.ok` y por qué debe comprobarse?**
Es un booleano que indica si la respuesta fue satisfactoria (`true` para códigos 200–299). Debe comprobarse porque `fetch` NO rechaza la promesa ante errores HTTP: una respuesta 404 o 500 resuelve la promesa normalmente; sin verificar `response.ok` trataríamos un error como un éxito.

**20. ¿Qué diferencia existe entre un error HTTP (404) y un error de conexión?**
Un error HTTP significa que hubo comunicación: el servidor respondió, pero con un estado no satisfactorio (accesible vía `respuesta.status`). Un error de conexión es la imposibilidad de recibir respuesta (servidor caído, sin red, DNS fallido): en ese caso `fetch` rechaza la promesa y salta el `catch`. Por eso capturamos la red en `try` y verificamos `response.ok` después.

**21. ¿Qué sucede si el servidor devuelve una respuesta no satisfactoria y el código no comprueba `response.ok`?**
El código intentaría parsear el cuerpo del error como si fuera una respuesta válida. Podríamos mostrar datos inexistentes o `undefined` al usuario, e informar un "éxito" que nunca ocurrió, ocultando el problema real.

**22. ¿Para qué se utiliza `try/catch` con async/await? ¿Qué errores puede gestionar?**
`try/catch` captura cualquier promesa rechazada dentro de la función `async` (igual que una excepción). Permite gestionar: errores de conexión (rechazo de `fetch`), errores HTTP (que nosotros lanzamos manualmente al fallar `response.ok`) y errores de parseo del JSON (`response.json()` sobre contenido inválido).

**23. ¿Qué ocurriría si la respuesta no contuviera JSON válido y se ejecutara `response.json()`?**
La promesa devuelta por `response.json()` se rechaza con un `SyntaxError`. Sin `try/catch`, ese error quedaría sin manejar (en consola, como promesa rechazada no capturada) y la aplicación no informaría nada al usuario. En `apiClient.js` lo capturamos y lo traducimos en un mensaje claro.

**24. ¿Cómo modificarías la aplicación para mostrar un mensaje comprensible cuando falle la conexión?**
Ya está implementado: en `enviarPublicacion()` el `fetch` está dentro de un `try`; si la promesa se rechaza (sin red, servidor caído) lanzamos un `ErrorPublicacion` con tipo `"conexion"` y un mensaje claro, que el controlador presenta en el DOM. El usuario ve "No se pudo conectar con el servidor..." y puede reintentar.

---

## E. Validación, interfaz y comportamiento

**25. ¿Por qué validar antes de enviar? ¿Cómo impedirías campos vacíos o con solo espacios?**
Para no enviar datos inútiles a la API ni recibir errores del servidor, y para dar inmediatamente una retroalimentación clara. Se aplica `trim()` para descartar espacios: si el valor recortado es `""` se muestra el error y se corta el flujo antes del `fetch`. Implementado en `validarCampo()` (`js/validation/postValidator.js`).

**26. ¿Por qué deshabilitar temporalmente el botón? ¿Cuándo reactivarlo?**
Para evitar envíos repetidos (doble clic o Enter) que generen peticiones duplicadas mientras el primero sigue en curso. Se reactiva en el bloque `finally`, que se ejecuta siempre (éxito o error), garantizando que la aplicación vuelva a ser usable.

**27. ¿Cómo implementarías un indicador de carga y qué debería ocurrir si falla la operación?**
Mostrando una región con un spinner y texto mientras la promesa está pendiente, y fijando `aria-busy="true"` (accesibilidad). Si la operación falla, el `finally` oculta el indicador y restablece los controles, mientras el `catch` muestra el mensaje de error correspondiente. Implementado en `establecerCarga()` (`js/ui/domView.js`).

**28. ¿Cómo evitarías que el navegador recargue la página al enviar el formulario? Explica `event.preventDefault()`.**
El envío nativo de un `<form>` provoca una navegación/recarga. `event.preventDefault()` cancela ese comportamiento por defecto del evento, dejando la página intacta para que JavaScript procese todo de forma asíncrona. Es la primera línea de `manejarEnvio()` (`js/main.js`).

---

## F. Análisis, pruebas y mejoras

**29. ¿Cómo comprobarías, con las herramientas del navegador, que la petición POST se ejecutó correctamente? ¿Qué revisarías en Network?**
Abrir DevTools → pestaña Network y enviar el formulario. Se verifica: que aparezca la petición `posts`, el método **POST**, la URL correcta, en *Headers* el `Content-Type: application/json` enviado, en *Payload* el cuerpo JSON (`title`, `body`, `userId`) y en *Response* el 201 con el objeto devuelto (con `id` simulado). También se revisa la consola para descartar errores.

**30. Si el servidor devuelve un `id` pero no encuentro el mensaje al consultar la API, ¿cómo explicarlo y qué cambiaría para persistencia real?**
JSONPlaceholder es una API simulada: replica la sintaxis HTTP (devuelve 201 y un `id` correlativo) pero no almacena nada; cualquier GET a `/posts` devuelve siempre el mismo conjunto fijo de datos. Para persistencia real se reemplazaría la URL por un backend propio (Node/Express, Rails, etc.) con una base de datos, conservando la misma estructura de la petición: al crear el recurso, el servidor lo guardaría y los GETs posteriores lo devolverían.
