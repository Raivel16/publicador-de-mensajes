# Publicador de mensajes

Miniaplicación web que valida una publicación, la envía a una API REST mediante una petición HTTP `POST` (Fetch API) y presenta la respuesta en el DOM, con gestión de estados de carga y errores.

Desarrollada únicamente con **HTML5, CSS3 y JavaScript (vanilla)**, organizada por capas y sin dependencias.

---

## Cómo ejecutarla

La app usa **ES modules** (`<script type="module">`), por lo que debe servirse desde un servidor HTTP local (no funciona abriendo `index.html` con `file://`).

```bash
npx serve .
```

Luego abrí la URL que imprime en consola (por defecto `http://localhost:3000`).

> `npx serve` descarga y ejecuta el paquete `serve` sin necesidad de instalarlo globalmente.

---

## Estructura por capas

```
publicador-de-mensajes/
├── index.html                          → Vista: estructura del formulario y regiones de mensajes
├── css/
│   └── styles.css                      → Presentación: estilos y estados (error/éxito/carga/deshabilitado)
└── js/
    ├── main.js                         → Entrada: selección del DOM + addEventListener("submit") + preventDefault
    ├── controller/postController.js    → Control: valida, gestiona estados, orquesta el flujo, try/catch/finally
    ├── validation/postValidator.js     → Negocio: validación de título y contenido con trim()
    ├── api/apiClient.js                → Datos: fetch POST, JSON.stringify, response.ok, response.json()
    └── ui/domView.js                   → Presentación JS: render seguro con textContent (sin innerHTML)
```

**Flujo de una publicación:**

```
usuario envía el formulario
        │
        ▼
main.js: preventDefault() + lee los valores de los campos
        │
        ▼
postController.js: valida con postValidator.js ── inválido ──▶ muestra errores y corta (sin fetch)
        │ válido
        ▼
   establecerCarga(true)  → indicador visible + botón deshabilitado
        │
        ▼
apiClient.js: fetch(URL, { method: "POST", headers, body: JSON.stringify(...) })
        │
        ├── fallo de conexión  ─▶ ErrorPublicacion("conexion")
        ├── !response.ok      ─▶ ErrorPublicacion("http")
        └── JSON inválido     ─▶ ErrorPublicacion("respuesta")
        │
        ▼ (respuesta OK)
domView.js: muestra los datos devueltos (id, title, body, userId) con textContent
        │
        ▼
finally: establecerCarga(false) → se restablece SIEMPRE, incluso con error
```

---

## Qué probar (pruebas funcionales)

Ejecutá `npx serve .` y verificá estos escenarios:

| # | Escenario | Cómo probarlo | Resultado esperado |
|---|-----------|---------------|--------------------|
| 1 | Campos vacíos | Enviar el formulario sin escribir nada | Dos mensajes de error; **no** se realiza ninguna petición (verificar en Network) |
| 2 | Solo espacios | Escribir `"   "` en título y/o contenido | Error "no puede estar vacío ni contener solo espacios" (gracias a `trim()`); sin petición |
| 3 | Envío válido | Título y contenido con texto real | Indicador de carga → resultado con `id`, `title`, `body`, `userId`; botón se rehabilita |
| 4 | Fallo de conexión | DevTools → Network → marcar "Offline" y enviar | Mensaje "No se pudo conectar..."; el botón se restablece y permite reintentar |
| 5 | Envíos repetidos | Hacer clic varias veces rápido en "Publicar" | El botón queda deshabilitado durante el envío: solo se envía una petición |

---

## Verificación técnica en DevTools (pestaña Network)

Al enviar una publicación válida, revisá:

- **Método:** `POST`
- **URL:** `https://jsonplaceholder.typicode.com/posts`
- **Request Headers:** `Content-Type: application/json`
- **Payload:** cuerpo JSON con `title`, `body` y `userId`
- **Response:** estado `201 Created` con un objeto que incluye un `id` (simulado)

---

## Nota sobre la API

[JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) es una API de prueba: devuelve respuestas simuladas (incluido un `id` al crear) pero **no almacena nada de forma persistente**. Recibir un `201` no significa que el mensaje quedó guardado: un GET posterior devolverá siempre el mismo conjunto fijo de datos.

---

## Mapa de requisitos técnicos → código

| Requisito | Dónde se implementa |
|-----------|---------------------|
| HTML, CSS y JS en archivos separados | `index.html`, `css/styles.css`, `js/*` |
| `addEventListener()` para el envío | `js/main.js` |
| `event.preventDefault()` | `js/main.js` (`manejarEnvio`) |
| Fetch con POST y `Content-Type: application/json` | `js/api/apiClient.js` |
| Serialización con `JSON.stringify()` | `js/api/apiClient.js` |
| Procesamiento con `async/await` | `js/api/apiClient.js` y `js/controller/postController.js` |
| Comprobación de `response.ok` | `js/api/apiClient.js` |
| `response.json()` | `js/api/apiClient.js` |
| Validación previa con `trim()` | `js/validation/postValidator.js` |
| Mostrar mensajes y resultados por el DOM | `js/ui/domView.js` |
| Errores de conexión, HTTP y de JSON | `js/api/apiClient.js` (clase `ErrorPublicacion`) |
| Deshabilitar botón y restablecer en `finally` | `js/ui/domView.js` + `js/controller/postController.js` |
| Inserción segura (`textContent`, sin `innerHTML`) | `js/ui/domView.js` |

---

## Licencia

Uso académico — Trabajo práctico de Ingeniería Web.
