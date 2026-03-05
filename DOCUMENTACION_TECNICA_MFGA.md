# DOCUMENTACION_TECNICA_MFGA

Fecha: 2026-02-28  
Repositorio: `C:\Users\speit\Desktop\Tesis-MFGA`

## 1. Introduccion

Este documento consolida una especificacion academica y tecnica del sistema MFGA a partir del analisis directo del codigo del repositorio. La documentacion fue construida exclusivamente sobre evidencia implementada en el proyecto y no sobre supuestos de negocio externos.

El alcance del analisis comprende:

- Frontend web: `frontend/webV2`
- Frontend mobile: `frontend/mobilev2/mfga_mobile`
- Backend API: `backend`

Cuando una funcionalidad aparece incompleta, local-only, visual o dependiente de configuracion no incluida en el repositorio, se marca como `parcial / en progreso`.

## 2. Metodologia de relevamiento

La identificacion de requerimientos y flujos se realizo a partir de:

- Estructura de carpetas y archivos.
- Paginas HTML y pantallas Expo Router.
- Scripts de UI y almacenamiento local.
- Llamadas `fetch` y uso de `AsyncStorage`, `localStorage` y `sessionStorage`.
- Rutas, controladores, modelos y middleware del backend.
- OpenAPI, README y variables de entorno observadas en codigo.

## 3. Vision general del sistema

MFGA se compone de tres capas principales:

1. Un frontend web con experiencia publica y experiencia autenticada para exploracion turistica.
2. Una aplicacion mobile Expo/React Native orientada a un MVP de registro y gestion local de actividades.
3. Un backend Express + PostgreSQL que centraliza usuarios, autenticacion, guias, atracciones y comunidad.

## 4. Frontend Web (webV2)

### 4.1 Requerimientos funcionales

| ID | Descripcion | Actores | Flujo basico | Pantallas / Endpoints | Estado |
| --- | --- | --- | --- | --- | --- |
| RF-WEB-01 | El sistema debe proveer una landing publica con secciones de presentacion, galeria y contacto. | Visitante | El usuario abre la home, navega por anclas y consulta informacion del producto. | `index.html`, `script.js` | Implementado |
| RF-WEB-02 | El sistema debe permitir registro web contra la API. | Visitante, Sistema | El usuario completa formulario, el frontend valida y ejecuta `POST /api/users`. | `Login_Register/*`, `/api/users` | Implementado |
| RF-WEB-03 | El sistema debe permitir login con email y contrasena, guardar sesion y redirigir al dashboard. | Visitante | Se validan credenciales, se ejecuta `POST /api/auth/login` y se persiste `mfga_session`. | `login.js`, `/api/auth/login` | Implementado |
| RF-WEB-04 | El sistema debe bloquear paginas protegidas cuando no existe sesion valida. | Usuario, Sistema | Cada pagina autenticada verifica `mfga_session` y redirige al login si falta. | `after_login/*.html`, `header.js` | Implementado |
| RF-WEB-05 | El sistema debe mostrar un dashboard autenticado con saludo personalizado y accesos a modulos. | Usuario | Tras iniciar sesion, el usuario accede a Discover, Audio Guides, Nearby Attractions y Travel Community. | `after_login/logged_in.html` | Implementado |
| RF-WEB-06 | El usuario debe poder editar nombre, email y telefono desde el perfil. | Usuario | La UI abre modal, valida y ejecuta `PATCH /api/users/:id`. | Modales comunes, `/api/users/:id` | Implementado |
| RF-WEB-07 | El usuario debe poder cambiar su contrasena desde la UI autenticada. | Usuario | La UI valida password actual/nueva y ejecuta `POST /api/auth/change-password` con JWT. | Modales comunes, `/api/auth/change-password` | Implementado |
| RF-WEB-08 | El usuario debe poder cerrar sesion eliminando el estado local. | Usuario | La UI limpia la sesion y vuelve al login. | `header.js` | Implementado |
| RF-WEB-09 | El sistema debe listar destinos en Discover Places V2 a partir de `destinations.json`. | Usuario | Carga el JSON local, renderiza cards y permite abrir detalle por `id`. | `Discover_PlacesV2/*` | Implementado |
| RF-WEB-10 | El sistema debe mostrar el detalle de un destino con informacion ampliada, galeria, mapa y tips. | Usuario | `place.html` carga el destino desde `destinations.json` y lo renderiza. | `Discover_PlacesV2/place/*` | Implementado |
| RF-WEB-11 | El sistema mantiene una version anterior de Discover Places con datos hardcodeados. | Usuario | La pantalla filtra por texto y categoria un dataset local. | `Discover_places/*` | Parcial / desplazado |
| RF-WEB-12 | El sistema debe ofrecer un catalogo de audio guides con filtros, busqueda y reproduccion. | Usuario | Se renderiza un catalogo local, se intenta sincronizar directorio de guias y se habilita reproduccion. | `Audio_guides/audio_guide.*`, `/api/guides` | Implementado |
| RF-WEB-13 | El sistema debe guardar progreso y reanudacion de audio por usuario. | Usuario | El progreso se persiste localmente y se usa en Continue Listening. | `audio_guide.js` | Implementado |
| RF-WEB-14 | El usuario debe poder puntuar, comentar y enviar mensajes a un guia. | Usuario | El perfil del guia resuelve `guideId`, carga detalle y consume endpoints protegidos. | `guide_profile.*`, `/api/guides/*` | Implementado |
| RF-WEB-15 | El sistema debe buscar atracciones por filtros y por cercania con soporte de geolocalizacion y mapa. | Usuario, Navegador | Nearby carga catalogo, aplica filtros, usa geolocalizacion y sincroniza grid con Leaflet. | `Nearby_attractions/*`, `/api/attractions*` | Implementado |
| RF-WEB-16 | El sistema debe mostrar un feed de comunidad con filtros, publicaciones, likes y comentarios. | Usuario | Se cargan posts, se filtran, se publica en API y se interactua con likes/comentarios. | `Travel_community/*`, `/api/community/*` | Implementado |
| RF-WEB-17 | El sistema debe permitir bookmarks, grupos y meetups con persistencia local. | Usuario | El usuario alterna estados y se guardan en `localStorage`. | `travel_community.js` | Parcial / local-only |
| RF-WEB-18 | El sistema muestra social login y opcion de contacto sin flujo de backend cerrado. | Visitante | La UI expone botones y placeholders, pero no existe integracion completa. | `login.js`, `index.html` | Parcial / en progreso |

### 4.2 Requerimientos no funcionales

| ID | Categoria | Descripcion | Criterio de aceptacion |
| --- | --- | --- | --- |
| RNF-WEB-01 | Seguridad | Las paginas autenticadas deben requerir sesion local valida. | Sin `mfga_session`, la pagina redirige a login. |
| RNF-WEB-02 | Seguridad | Las operaciones protegidas deben enviar JWT en encabezado `Authorization`. | Los endpoints de perfil, password, comunidad y guias reciben `Bearer token`. |
| RNF-WEB-03 | Usabilidad | La interfaz debe ser responsive y navegable en desktop y mobile. | Navbar movil, cards y modales funcionan en ambos contextos. |
| RNF-WEB-04 | Usabilidad | La UI debe proveer feedback visible de exito, error y estado vacio. | Formularios y acciones muestran mensajes, toasts o empty states. |
| RNF-WEB-05 | Performance | Las pantallas con carga remota deben mostrar loaders o skeletons. | Discover V2, Community y Nearby no quedan en blanco durante la carga. |
| RNF-WEB-06 | Confiabilidad | El frontend debe degradar de forma controlada cuando la API no esta disponible. | Community y Nearby usan fallback local sin romper la navegacion. |
| RNF-WEB-07 | Mantenibilidad | La logica comun de sesion y perfil debe concentrarse en componentes reutilizables. | `shared/session.js` y `header.js` actuan como piezas comunes. |
| RNF-WEB-08 | Compatibilidad | El frontend depende de browser moderno, APIs web y recursos CDN. | El sistema requiere `fetch`, `localStorage`, `Audio`, `geolocation`, Tailwind y Feather/Leaflet. |
### 4.3 Casos de uso principales

#### UC-WEB-01 - Registrar usuario

- Actor principal: Visitante.
- Precondiciones: El backend responde en `/api/users`.
- Disparador: El usuario envia el formulario de registro.
- Flujo principal:
  1. Completa nombre, email, telefono opcional y contrasena.
  2. El frontend valida datos y coincidencia de contrasena.
  3. Ejecuta `POST /api/users`.
  4. Recibe confirmacion y mensaje de verificacion por correo.
- Flujos alternativos y excepciones: email duplicado, campos faltantes, falla de correo SMTP.
- Postcondiciones: Usuario creado en estado no verificado.
- Reglas de negocio: `Name`, `Email` y `Password` obligatorios; email unico.

#### UC-WEB-02 - Iniciar sesion

- Actor principal: Visitante.
- Precondiciones: Usuario existente, password valida y cuenta verificada.
- Disparador: Envio del login.
- Flujo principal:
  1. El usuario ingresa email y contrasena.
  2. El frontend ejecuta `POST /api/auth/login`.
  3. Guarda `mfga_session`.
  4. Redirige al dashboard.
- Flujos alternativos y excepciones: credenciales invalidas, cuenta no verificada, error interno.
- Postcondiciones: Sesion local activa.
- Reglas de negocio: JWT con expiracion de 7 dias.

#### UC-WEB-03 - Administrar perfil

- Actor principal: Usuario autenticado.
- Precondiciones: Existe sesion valida con `UserId`.
- Disparador: El usuario elige `Edit Profile` o `Change Password`.
- Flujo principal:
  1. Abre modal correspondiente.
  2. Modifica datos o contrasena.
  3. La UI valida y ejecuta el endpoint requerido.
  4. Se actualiza la sesion y la interfaz.
- Flujos alternativos y excepciones: sin cambios, email duplicado, password actual incorrecta, token invalido.
- Postcondiciones: Perfil o contrasena actualizados.
- Reglas de negocio: cambio de contrasena solo para el usuario autenticado.

#### UC-WEB-04 - Explorar destinos y audio guides

- Actor principal: Usuario autenticado.
- Precondiciones: Sesion activa; archivos locales disponibles.
- Disparador: Navegacion a Discover Places o Audio Guides.
- Flujo principal:
  1. La UI carga destinos o guias.
  2. El usuario accede al detalle de un destino o reproduce una guia.
  3. El sistema muestra contenido ampliado y conserva progreso local en audio.
- Flujos alternativos y excepciones: archivo JSON faltante, audio faltante, destino inexistente.
- Postcondiciones: Consulta realizada y, en audio, progreso guardado.
- Reglas de negocio: progreso de audio por usuario.

#### UC-WEB-05 - Interactuar con guias y atracciones

- Actor principal: Usuario autenticado.
- Precondiciones: Sesion valida; guia o atracciones disponibles.
- Disparador: Puntuar/comentar guia o usar Nearby Attractions.
- Flujo principal:
  1. La web resuelve un guia o carga atracciones.
  2. El usuario puntua, comenta, envia mensaje o busca atracciones cercanas.
  3. La API procesa la operacion y la UI actualiza estado o mapa.
- Flujos alternativos y excepciones: usuario sin token, geolocalizacion denegada, guia inexistente, sin resultados.
- Postcondiciones: Interaccion persistida o resultados filtrados en pantalla.
- Reglas de negocio: rating 1..5; `lat/lng` validos para nearby.

#### UC-WEB-06 - Publicar e interactuar en comunidad

- Actor principal: Usuario autenticado.
- Precondiciones: Sesion activa.
- Disparador: Publicar post o accionar like/comentario.
- Flujo principal:
  1. El usuario redacta una publicacion.
  2. La UI valida longitud minima.
  3. Se ejecuta `POST /api/community/posts`.
  4. El usuario puede dar like, comentar o guardar bookmark local.
- Flujos alternativos y excepciones: mensaje corto, comentario vacio, sin token, API no disponible.
- Postcondiciones: Feed actualizado con nuevas interacciones.
- Reglas de negocio: categorias cerradas y publicacion minima de 12 caracteres.

### 4.4 Casos de prueba propuestos

| ID | Tipo | Objetivo | Precondiciones | Pasos resumidos | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| TC-WEB-01 | UI | Registro exitoso | Backend activo | Completar formulario y enviar | Usuario creado y mensaje visible |
| TC-WEB-02 | Negativa | Registro con email duplicado | Email existente | Repetir alta | Error visible y respuesta `409` |
| TC-WEB-03 | UI | Login exitoso | Usuario verificado | Ingresar credenciales correctas | Sesion guardada y redireccion |
| TC-WEB-04 | Negativa | Bloqueo de pagina protegida sin sesion | Sesion inexistente | Abrir modulo protegido | Redireccion a login |
| TC-WEB-05 | UI | Edicion de perfil | Sesion activa | Cambiar nombre/email/telefono | Datos actualizados en UI y backend |
| TC-WEB-06 | UI | Cambio de contrasena | Sesion activa | Completar modal y confirmar | Password actualizada |
| TC-WEB-07 | UI | Discover Places V2 | Sesion activa | Abrir catalogo y detalle | Destino visible y consistente |
| TC-WEB-08 | UI | Audio guide con reanudacion | Sesion activa | Reproducir, cerrar y reanudar | Continue Listening operativo |
| TC-WEB-09 | UI | Interaccion con guia | Sesion activa | Puntuar, comentar y mensajear | Feedback de exito y refresco |
| TC-WEB-10 | UI | Nearby con geolocalizacion | Permiso concedido | Usar ubicacion y aplicar filtros | Mapa centrado y orden por cercania |
| TC-WEB-11 | UI | Publicacion en community | Sesion activa | Crear post valido | Post visible en el feed |
| TC-WEB-12 | Negativa | Community sin token o con mensaje invalido | Sesion faltante o texto corto | Intentar publicar/comentar | Rechazo controlado |
| TC-WEB-13 | Regresion | Flujo MVP web | Usuario verificado | Login, dashboard, modulos, logout | Navegacion integral sin roturas |

## 5. Frontend Mobile (mfga_mobile)

### 5.1 Requerimientos funcionales

| ID | Descripcion | Actores | Flujo basico | Pantallas / Endpoints | Estado |
| --- | --- | --- | --- | --- | --- |
| RF-MOB-01 | La app debe mostrar splash solo en primera ejecucion. | Usuario, Sistema | `_layout.tsx` consulta `splash_seen`, muestra splash y luego navega al home. | `app/_layout.tsx`, `app/SplashScreen.tsx` | Implementado |
| RF-MOB-02 | La app debe exponer un home de navegacion con accesos a modulos. | Usuario | El usuario selecciona una opcion y Expo Router navega a la pantalla correspondiente. | `app/index.tsx` | Implementado |
| RF-MOB-03 | La app debe registrar usuarios contra la API backend. | Usuario | Completa formulario, valida datos minimos y ejecuta `POST /api/users`. | `app/registro.tsx`, `/api/users` | Implementado |
| RF-MOB-04 | La app debe guardar localmente el usuario registrado. | Usuario, Sistema | Tras un alta exitosa, se persiste `current_user` en `AsyncStorage`. | `app/registro.tsx` | Implementado |
| RF-MOB-05 | La app debe permitir crear actividades locales con imagen y ubicacion. | Usuario | Selecciona imagen, solicita ubicacion, completa datos y guarda en `AsyncStorage`. | `app/agregar-actividad.tsx` | Implementado |
| RF-MOB-06 | La app debe listar actividades guardadas mostrando datos, imagen y mapa. | Usuario | Lee `actividades` de `AsyncStorage` y renderiza `FlatList` con `MapView` si hay coordenadas. | `app/ver-actividades.tsx` | Implementado |
| RF-MOB-07 | La app debe permitir editar y eliminar actividades locales. | Usuario | Abre actividad por tap, guarda cambios o elimina por long press con confirmacion. | `app/editar-actividad.tsx`, `app/ver-actividades.tsx` | Implementado |
| RF-MOB-08 | La app muestra accesos a agregar paisaje, provincia y municipio. | Usuario | Existen rutas visibles en el home, pero sin logica funcional implementada. | `app/agregar-paisaje.tsx`, `app/agregar-provincia.tsx`, `app/agregar-municipio.tsx` | Parcial / en progreso |
| RF-MOB-09 | La app presenta tabs de busqueda avanzada/rapida y menu hamburguesa en home. | Usuario | Se muestran elementos visuales sin comportamiento real. | `app/index.tsx` | Parcial / visual |

### 5.2 Requerimientos no funcionales

| ID | Categoria | Descripcion | Criterio de aceptacion |
| --- | --- | --- | --- |
| RNF-MOB-01 | Seguridad | El formulario de registro debe validar datos minimos antes de llamar a la API. | No se envia alta si faltan campos o las contrasenas no coinciden. |
| RNF-MOB-02 | Usabilidad | Las acciones principales deben informar exito o error mediante `Alert`. | Registrar, guardar, editar y eliminar muestran feedback explicito. |
| RNF-MOB-03 | Confiabilidad | Las actividades deben persistir entre reinicios de la app. | `AsyncStorage` rehidrata la lista al volver a abrir la aplicacion. |
| RNF-MOB-04 | Mantenibilidad | Las pantallas pendientes deben documentarse como alcance incompleto. | Paisaje, provincia y municipio no se consideran funcionalidad cerrada. |
| RNF-MOB-05 | Compatibilidad | La app depende del stack Expo y de modulos nativos como maps, location e image-picker. | Debe ejecutarse en un entorno compatible con las dependencias declaradas. |
### 5.3 Casos de uso principales

#### UC-MOB-01 - Primera apertura con splash

- Actor principal: Usuario mobile.
- Precondiciones: La app no posee la clave `splash_seen`.
- Disparador: Apertura inicial de la aplicacion.
- Flujo principal:
  1. `_layout.tsx` consulta `splash_seen`.
  2. Si no existe, muestra `SplashScreen`.
  3. Persiste la bandera de visualizacion.
  4. Redirige al home.
- Flujos alternativos y excepciones: Si la bandera ya existe, el splash se omite.
- Postcondiciones: El usuario accede al home.
- Reglas de negocio: Splash de una sola visualizacion por instalacion.

#### UC-MOB-02 - Registrar usuario desde mobile

- Actor principal: Usuario mobile.
- Precondiciones: Backend alcanzable y `EXPO_PUBLIC_API_URL` correctamente configurada o fallback valido.
- Disparador: El usuario envia el formulario de registro.
- Flujo principal:
  1. Completa nombre, email, telefono y contrasena.
  2. La app valida campos minimos y confirmacion.
  3. Ejecuta `POST /api/users`.
  4. Guarda la respuesta en `AsyncStorage`.
  5. Informa exito y vuelve al home.
- Flujos alternativos y excepciones: contrasenas distintas, backend inaccesible, email duplicado.
- Postcondiciones: Usuario registrado local y remotamente.
- Reglas de negocio: nombre, email y contrasena obligatorios.

#### UC-MOB-03 - Crear actividad local

- Actor principal: Usuario mobile.
- Precondiciones: Pantalla de alta disponible.
- Disparador: El usuario presiona `Guardar`.
- Flujo principal:
  1. Selecciona una imagen desde galeria.
  2. Solicita ubicacion actual.
  3. Completa nombre, descripcion y provincia.
  4. La app persiste la actividad en `AsyncStorage`.
- Flujos alternativos y excepciones: permiso de ubicacion denegado, campos vacios.
- Postcondiciones: Actividad almacenada localmente.
- Reglas de negocio: nombre, descripcion y provincia obligatorios.

#### UC-MOB-04 - Consultar, editar y eliminar actividades

- Actor principal: Usuario mobile.
- Precondiciones: Existen actividades guardadas.
- Disparador: Apertura de `Ver Actividades` o interaccion sobre un item.
- Flujo principal:
  1. La app carga actividades desde `AsyncStorage`.
  2. Muestra datos, imagen y mapa si hay coordenadas.
  3. El usuario toca un item para editarlo o hace long press para eliminarlo.
  4. La app actualiza el almacenamiento local.
- Flujos alternativos y excepciones: lista vacia, `id` inexistente, lectura local fallida.
- Postcondiciones: Lista sincronizada con el almacenamiento local.
- Reglas de negocio: eliminacion con confirmacion por alerta.

### 5.4 Casos de prueba propuestos

| ID | Tipo | Objetivo | Precondiciones | Pasos resumidos | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| TC-MOB-01 | UI | Splash en primera apertura | Sin `splash_seen` | Abrir la app | Splash visible y luego home |
| TC-MOB-02 | UI | Registro exitoso | API configurada y backend activo | Completar formulario y enviar | Alerta de exito y `current_user` persistido |
| TC-MOB-03 | Negativa | Registro con contrasenas distintas | Ninguna | Completar formulario con confirmacion incorrecta | Error local y sin alta |
| TC-MOB-04 | Negativa | Registro con backend inaccesible | API incorrecta o backend apagado | Intentar registrar | Alerta de error de red |
| TC-MOB-05 | UI | Alta de actividad con imagen y ubicacion | Permisos concedidos | Seleccionar imagen, obtener ubicacion, guardar | Actividad visible en listado |
| TC-MOB-06 | Negativa | Permiso de ubicacion denegado | Permiso bloqueado | Solicitar ubicacion | Mensaje de permiso denegado |
| TC-MOB-07 | UI | Edicion de actividad | Actividad existente | Abrir item, modificar y guardar | Lista actualizada |
| TC-MOB-08 | UI | Eliminacion de actividad | Actividad existente | Long press y confirmar | Item eliminado de `AsyncStorage` |
| TC-MOB-09 | Regresion | Flujo MVP mobile | App operativa | Splash, registro, alta, listado, edicion, borrado | Navegacion y persistencia sin roturas |

## 6. Backend (API)

### 6.1 Requerimientos funcionales

| ID | Descripcion | Actores | Flujo basico | Endpoints / Componentes | Estado |
| --- | --- | --- | --- | --- | --- |
| RF-BE-01 | El backend debe iniciar Express, probar la conexion a PostgreSQL y servir web estatica. | Sistema | Carga variables de entorno, prueba DB y levanta el servidor. | `index.js`, `ConnectDatabase.js` | Implementado |
| RF-BE-02 | La API debe publicar documentacion Swagger. | Sistema, Desarrollador | Carga `openapi.yaml` y monta Swagger UI. | `/api/docs` | Implementado |
| RF-BE-03 | La API debe listar usuarios. | Cliente | Consulta la tabla `user` y devuelve columnas seleccionadas. | `GET /api/users` | Implementado |
| RF-BE-04 | La API debe obtener usuario por ID. | Cliente | Busca por `UserId` y responde `404` si no existe. | `GET /api/users/:id` | Implementado |
| RF-BE-05 | La API debe crear usuarios con password hasheada y token de verificacion. | Cliente, Sistema | Valida datos, verifica email unico, hashea, inserta y envia correo best-effort. | `POST /api/users` | Implementado |
| RF-BE-06 | La API debe actualizar usuarios por ID. | Cliente | Valida colisiones de email, hashea password si llega y actualiza campos permitidos. | `PATCH /api/users/:id` | Implementado |
| RF-BE-07 | La API debe eliminar usuarios por ID. | Cliente | Ejecuta `DELETE` y devuelve booleano de exito. | `DELETE /api/users/:id` | Implementado |
| RF-BE-08 | La API debe autenticar usuarios con JWT. | Cliente | Valida credenciales, verifica cuenta, actualiza `LastLogin` y emite token. | `POST /api/auth/login` | Implementado |
| RF-BE-09 | La API debe verificar correo mediante token. | Usuario, Sistema | Valida token, expiracion, actualiza usuario y redirige al login. | `GET /api/auth/verify-email` | Implementado |
| RF-BE-10 | La API debe permitir cambio de contrasena del usuario autenticado. | Usuario | `requireAuth` valida JWT y el controller actualiza el hash si la password actual es correcta. | `POST /api/auth/change-password` | Implementado |
| RF-BE-11 | La API debe listar guias activas y resolver guias por nombre o alias. | Cliente | Consulta `guide`, opcionalmente `guide_alias`, y devuelve informacion resumida. | `GET /api/guides`, `GET /api/guides/resolve` | Implementado |
| RF-BE-12 | La API debe devolver detalle de guia y resumen de ratings. | Cliente | Busca guia, calcula promedio y cantidad de votos. | `GET /api/guides/:id` | Implementado |
| RF-BE-13 | La API debe listar, crear o actualizar comentarios y ratings de guia, y recibir mensajes. | Usuario, Cliente | Lista comentarios; protege operaciones POST y persiste interacciones del usuario. | `/api/guides/:id/comments`, `/ratings`, `/messages` | Implementado |
| RF-BE-14 | La API debe listar atracciones con filtros y buscar atracciones cercanas por coordenadas. | Cliente | Filtra por categoria/provincia/busqueda; en nearby calcula distancia en SQL. | `GET /api/attractions`, `GET /api/attractions/nearby` | Implementado |
| RF-BE-15 | La API debe listar publicaciones comunitarias con contadores agregados. | Cliente | Consulta posts activos y agrega likes/comentarios. | `GET /api/community/posts` | Implementado |
| RF-BE-16 | La API debe permitir crear posts comunitarios autenticados. | Usuario | Valida JWT, categoria y longitud minima, luego inserta el post. | `POST /api/community/posts` | Implementado |
| RF-BE-17 | La API debe listar y crear comentarios sobre posts comunitarios. | Cliente, Usuario | Verifica existencia del post y persiste comentario con contador actualizado. | `GET/POST /api/community/posts/:id/comments` | Implementado |
| RF-BE-18 | La API debe listar likes del usuario y alternar like/unlike sobre publicaciones. | Usuario | Devuelve IDs likeados y alterna estado sobre un post. | `GET /api/community/posts/likes`, `POST /api/community/posts/:id/likes` | Implementado |

### 6.2 Requerimientos no funcionales

| ID | Categoria | Descripcion | Criterio de aceptacion |
| --- | --- | --- | --- |
| RNF-BE-01 | Seguridad | Las contrasenas deben almacenarse hasheadas con `bcryptjs`. | Ningun alta o actualizacion persiste password plano. |
| RNF-BE-02 | Seguridad | Los endpoints protegidos deben requerir JWT valido. | Sin `Bearer token`, la API responde `401`. |
| RNF-BE-03 | Seguridad | El login debe rechazar cuentas no verificadas, salvo excepcion legacy contemplada en codigo. | Usuarios nuevos sin verificar reciben `403`. |
| RNF-BE-04 | Confiabilidad | El servidor no debe iniciar si falla la conexion a DB. | `testConnection()` fallida provoca salida controlada. |
| RNF-BE-05 | Confiabilidad | Los controladores deben responder errores HTTP coherentes. | Se observan `400`, `401`, `403`, `404`, `409` y `500` segun el caso. |
| RNF-BE-06 | Performance | Los listados deben respetar limites maximos de consulta. | Attractions, community y comments recortan `limit` a topes definidos. |
| RNF-BE-07 | Mantenibilidad | El backend debe mantener separacion por rutas, controladores, modelos, middleware y servicios. | Cada endpoint es trazable entre capas. |
| RNF-BE-08 | Compatibilidad | La API depende de Node moderno con ESM y de PostgreSQL con un esquema concreto. | Sin runtime compatible ni esquema adecuado la API no queda plenamente operativa. |
### 6.3 Casos de uso principales

#### UC-BE-01 - Registrar usuario

- Actor principal: Cliente web o mobile.
- Precondiciones: Base de datos disponible.
- Disparador: `POST /api/users`.
- Flujo principal:
  1. La API recibe los datos del usuario.
  2. Valida obligatorios.
  3. Verifica unicidad de email.
  4. Hashea la contrasena.
  5. Genera token de verificacion.
  6. Inserta el usuario e intenta enviar correo.
- Flujos alternativos y excepciones: campos faltantes, email duplicado, error SMTP, error DB.
- Postcondiciones: Usuario persistido en estado no verificado.
- Reglas de negocio: token con expiracion de una hora.

#### UC-BE-02 - Iniciar sesion

- Actor principal: Cliente web o mobile.
- Precondiciones: Usuario existente, password valida y `JWT_SECRET` configurado.
- Disparador: `POST /api/auth/login`.
- Flujo principal:
  1. Se validan credenciales.
  2. Se busca usuario por email.
  3. Se compara hash.
  4. Se controla verificacion de correo.
  5. Se actualiza `LastLogin`.
  6. Se emite JWT.
- Flujos alternativos y excepciones: credenciales invalidas, cuenta no verificada, secreto ausente.
- Postcondiciones: Token emitido y sesion posible en cliente.
- Reglas de negocio: expiracion del JWT de 7 dias.

#### UC-BE-03 - Cambiar contrasena

- Actor principal: Usuario autenticado.
- Precondiciones: Token valido.
- Disparador: `POST /api/auth/change-password`.
- Flujo principal:
  1. `requireAuth` valida al usuario.
  2. El controller verifica identidad y password actual.
  3. Valida longitud minima de la nueva contrasena.
  4. Hashea la nueva password y actualiza el registro.
- Flujos alternativos y excepciones: token invalido, password actual incorrecta, usuario inexistente.
- Postcondiciones: Contrasena actualizada.
- Reglas de negocio: nueva contrasena minima de 6 caracteres.

#### UC-BE-04 - Consultar e interactuar con guias

- Actor principal: Cliente web / Usuario autenticado.
- Precondiciones: Tablas de guia disponibles.
- Disparador: llamadas a `/api/guides/*`.
- Flujo principal:
  1. La API lista guias o resuelve una por nombre/alias.
  2. Devuelve detalle y resumen de rating.
  3. Si el usuario esta autenticado, puede comentar, puntuar o enviar mensajes.
- Flujos alternativos y excepciones: guia inexistente, rating invalido, comentario vacio, sin token.
- Postcondiciones: Consulta o interaccion persistida.
- Reglas de negocio: rating entre 1 y 5; comentario/rating con estrategia upsert.

#### UC-BE-05 - Buscar atracciones

- Actor principal: Cliente web.
- Precondiciones: Tabla `attraction` poblada.
- Disparador: `GET /api/attractions` o `GET /api/attractions/nearby`.
- Flujo principal:
  1. La API recibe filtros.
  2. Normaliza `limit`, `radiusKm` y textos.
  3. Ejecuta consulta SQL.
  4. Devuelve resultados ordenados.
- Flujos alternativos y excepciones: `lat/lng` faltantes o invalidos en nearby.
- Postcondiciones: Catalogo listo para la UI.
- Reglas de negocio: nearby exige coordenadas validas.

#### UC-BE-06 - Publicar e interactuar en comunidad

- Actor principal: Usuario autenticado.
- Precondiciones: JWT valido y tablas comunitarias disponibles.
- Disparador: llamadas a `/api/community/*`.
- Flujo principal:
  1. La API lista publicaciones activas con contadores.
  2. El usuario autenticado crea posts validos.
  3. Puede comentar y alternar likes.
  4. La API responde con payload normalizado y contadores actualizados.
- Flujos alternativos y excepciones: categoria invalida, mensaje corto, comentario vacio, post inexistente, token invalido.
- Postcondiciones: Publicacion o interaccion persistida.
- Reglas de negocio: categorias cerradas; post minimo 12 caracteres; un like por usuario/post.

### 6.4 Casos de prueba propuestos

| ID | Tipo | Objetivo | Precondiciones | Pasos resumidos | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| TC-BE-01 | API | Alta de usuario | DB activa | `POST /api/users` con payload valido | Respuesta `201` y usuario creado |
| TC-BE-02 | Negativa | Email duplicado | Usuario existente | Repetir `POST /api/users` | Respuesta `409` |
| TC-BE-03 | API | Login exitoso | Usuario verificado | `POST /api/auth/login` correcto | JWT emitido y `LastLogin` actualizado |
| TC-BE-04 | Negativa | Login de cuenta no verificada | Usuario sin verificar | Intentar login | Respuesta `403` |
| TC-BE-05 | API | Verificacion de correo | Token valido | `GET /api/auth/verify-email` | Redirect y usuario verificado |
| TC-BE-06 | API | Cambio de contrasena | JWT valido | `POST /api/auth/change-password` | Password actualizada |
| TC-BE-07 | API | Rating y comentario de guia | JWT valido, guia existente | Enviar rating y comentario | Resumen y comentarios actualizados |
| TC-BE-08 | Negativa | Rating fuera de rango | JWT valido | Enviar `rating=0` o `6` | Respuesta `400` |
| TC-BE-09 | API | Nearby attractions | Atracciones con coordenadas | Llamar `/api/attractions/nearby` | Respuesta `200` con orden por cercania |
| TC-BE-10 | Negativa | Nearby sin coordenadas validas | Ninguna | Llamar endpoint sin `lat/lng` validos | Respuesta `400` |
| TC-BE-11 | API | Publicacion en community | JWT valido | `POST /api/community/posts` con mensaje valido | Post creado |
| TC-BE-12 | API | Like y comentario en community | JWT valido y post existente | Alternar like y comentar | Contadores actualizados |
| TC-BE-13 | Regresion | Flujo base del backend | Entorno operativo | Registrar, verificar, loguear, cambiar password, reloguear | Contrato consistente |

## 7. Trazabilidad resumida

| Modulo | Requerimientos clave | Casos de uso clave | Casos de prueba clave |
| --- | --- | --- | --- |
| Web - Auth | RF-WEB-02, RF-WEB-03, RF-WEB-04, RF-WEB-06, RF-WEB-07, RF-WEB-08 | UC-WEB-01, UC-WEB-02, UC-WEB-03 | TC-WEB-01, TC-WEB-03, TC-WEB-04 |
| Web - Discover y Audio | RF-WEB-09, RF-WEB-10, RF-WEB-12, RF-WEB-13, RF-WEB-14 | UC-WEB-04, UC-WEB-05 | TC-WEB-07, TC-WEB-08, TC-WEB-09 |
| Web - Nearby y Community | RF-WEB-15, RF-WEB-16, RF-WEB-17 | UC-WEB-05, UC-WEB-06 | TC-WEB-10, TC-WEB-11, TC-WEB-12 |
| Mobile - Registro | RF-MOB-03, RF-MOB-04 | UC-MOB-02 | TC-MOB-02, TC-MOB-03, TC-MOB-04 |
| Mobile - Actividades | RF-MOB-05, RF-MOB-06, RF-MOB-07 | UC-MOB-03, UC-MOB-04 | TC-MOB-05, TC-MOB-07, TC-MOB-08 |
| Backend - Auth y Users | RF-BE-03 a RF-BE-10 | UC-BE-01, UC-BE-02, UC-BE-03 | TC-BE-01 a TC-BE-06 |
| Backend - Guides | RF-BE-11 a RF-BE-13 | UC-BE-04 | TC-BE-07, TC-BE-08 |
| Backend - Attractions | RF-BE-14 | UC-BE-05 | TC-BE-09, TC-BE-10 |
| Backend - Community | RF-BE-15 a RF-BE-18 | UC-BE-06 | TC-BE-11, TC-BE-12 |

## 8. Hallazgos y elementos pendientes

### 8.1 Funcionalidades parciales o en progreso

- `Discover_places` web permanece en el repositorio, pero todo indica que `Discover_PlacesV2` es la version principal.
- Los botones de login social y el soporte Supabase del frontend web son placeholders, no flujo productivo cerrado.
- El formulario de contacto de la landing es solo local y no persiste en backend.
- Los grupos y meetups de Community son local-only.
- En mobile, `agregar-paisaje`, `agregar-provincia` y `agregar-municipio` no poseen implementacion funcional.
- En mobile, las tabs de busqueda y el menu hamburguesa son visuales.

### 8.2 Riesgos tecnicos observados

1. El backend no protege actualmente las rutas de usuarios con JWT ni roles.
2. El README del backend no cubre todas las variables de entorno reales del codigo.
3. No hay migraciones ni esquema SQL en el repositorio.
4. El mobile apunta por defecto a puerto `3000`, mientras el backend levanta por defecto en `4000`.
5. No se encontraron suites automaticas de testing.

### 8.3 Informacion faltante para cerrar la documentacion al 100%

Se necesita, como minimo:

- Un `.env.example` completo.
- DDL o migraciones de PostgreSQL.
- Definicion formal de roles y permisos.
- Confirmacion oficial de alcance para el Discover legado.
- Definicion funcional de los modulos mobile vacios.
- Evidencia de pruebas ejecutadas o automatizadas.

### 8.4 Variables de entorno observadas en codigo

#### Backend

- `API_PORT`
- `DATABASE_URL`
- `SUPABASE_DB_URL`
- `DB_SSL`
- `DB_POOL_MAX`
- `DB_IDLE_TIMEOUT`
- `DB_CONNECT_TIMEOUT`
- `JWT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `APP_BASE_URL`
- `FRONTEND_LOGIN_URL`

#### Mobile

- `EXPO_PUBLIC_API_URL`

#### Web

- `window.__API_BASE_URL__`
- `data-api-base-url`

## 9. Conclusion

A partir del codigo analizado, MFGA puede describirse como un sistema en estado de MVP funcional avanzado en web y backend, y de MVP mas acotado en mobile. La capa web ya implementa autenticacion, perfil, exploracion de destinos, audio guides, busqueda de atracciones y comunidad. El backend sostiene estos modulos con un contrato API coherente. La app mobile, en cambio, concentra hoy registro y gestion local de actividades, dejando otros modulos en estado parcial.

La documentacion aqui consolidada permite utilizar el proyecto como base para memoria tecnica, tesis o especificacion funcional, dejando explicitados tanto los alcances implementados como los vacios aun pendientes.
