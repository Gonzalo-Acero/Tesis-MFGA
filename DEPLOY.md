# Despliegue MFGA: Render (API) + Netlify (Web) + Expo Go (Mobile)

## Resumen rápido
- La API vive en Render y expone `/api`.
- La Web App se despliega en Netlify y consume la API mediante `API_BASE_URL` y/o proxy `/api/*` hacia Render.
- La Mobile App fue incorporada como segundo cliente y consume la misma API desde Expo Go.
- No se genera APK/AAB en esta etapa. La app mobile se ejecuta en modo desarrollo desde terminal con `npx expo start`.
- Toda la configuración se realiza mediante variables de entorno, sin dominios hardcodeados en HTML o JS.

## Arquitectura de despliegue
La solucion queda compuesta por tres partes principales:

1. **Backend API**
   - Desplegado en Render.
   - Implementado con Express.js.
   - Expone endpoints REST bajo `/api`.
   - Gestiona autenticacion, validaciones y acceso a datos.

2. **Web App**
   - Desplegada en Netlify.
   - Consume la API de Render por HTTPS.
   - Utiliza variables de entorno para definir `API_BASE_URL`.

3. **Mobile App**
   - Desarrollada en React Native con Expo.
   - Ejecutada localmente mediante terminal y abierta desde Expo Go.
   - Consume la misma API REST alojada en Render.
   - Utiliza `EXPO_PUBLIC_API_URL` para definir la URL base del backend.

## Render (API)
### 1) Variables de entorno (Dashboard -> Environment / Secret file)
Obligatorias:
- `DATABASE_URL` (cadena completa a Postgres)
- `DB_SSL=true`
- `API_PORT=4000`

Opcionales (performance):
- `DB_POOL_MAX` (default 10)
- `DB_IDLE_TIMEOUT` (30)
- `DB_CONNECT_TIMEOUT` (30)

Correo (si se usa mailer):
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

URLs auxiliares:
- `APP_BASE_URL=https://<tu-api>.onrender.com/api`
- `FRONTEND_LOGIN_URL=https://<tu-netlify>/Login_Register/Login.html`

### 2) Start command
```bash
node index.js
```
La aplicacion ya lee `/etc/secrets/.env` en Render y `.env` local en desarrollo.

### 3) Servicio web
Deploy standard en Render. La API quedara disponible en:
```text
https://<tu-api>.onrender.com/api
```

## Netlify (Web App)
### 1) Variables de entorno
```text
API_BASE_URL=https://<tu-api>.onrender.com/api
```

### 2) Build settings
- **Publish directory:** `frontend/webV2`
- **Build command:**
```bash
npm run generate:env
```
Este comando escribe `frontend/webV2/env.js` con `API_BASE_URL`.

### 3) Proxy a la API
En `netlify.toml` editar la linea:
```toml
to = "https://REPLACE_ME_RENDER_API.onrender.com/api/:splat"
```
Reemplazar por el host real de Render.

### 4) Resultado
El frontend utilizara `window.__API_BASE_URL__` generado en build y el proxy `/api` del mismo dominio.

## Mobile App (Expo Go)
### 1) Modalidad de ejecucion
La Mobile App no se distribuye como APK ni AAB en esta etapa. Se utiliza un flujo de ejecucion orientado a desarrollo:
- el proyecto se levanta desde terminal,
- Expo genera el bundle,
- el dispositivo abre la app mediante Expo Go,
- la app consume la API remota en Render.

### 2) Variable de entorno
Definir en el proyecto mobile:
```text
EXPO_PUBLIC_API_URL=https://<tu-api>.onrender.com/api
```

### 3) Ejecucion desde terminal
Desde la carpeta del proyecto mobile:
```bash
npx expo start
```
Tambien puede usarse:
```bash
expo start
```
segun la configuracion local del entorno.

### 4) Uso en dispositivo
- Abrir Expo Go en el telefono.
- Escanear el QR generado por Expo.
- Conectarse mediante **LAN**, **Tunnel** o **localhost** segun disponibilidad.
- La aplicacion cargara el bundle servido por Metro Bundler.

### 5) Consideraciones
- Si se prueba desde dispositivo fisico, la API debe ser accesible desde internet o por una red valida para el dispositivo.
- Se recomienda usar `Tunnel` cuando haya problemas de red local.
- La Mobile App consume exactamente los mismos endpoints que la Web App.

## Integracion continua y flujo de entrega
La integracion continua se realiza desde GitHub hacia los proveedores de despliegue en los componentes desplegables del sistema:

- **Web App:** GitHub dispara el build y despliegue automatico en Netlify.
- **Backend API:** GitHub dispara el build y despliegue automatico en Render.
- **Mobile App (Expo Go):** no genera un artefacto instalable. Su ejecucion se realiza en modo desarrollo desde terminal con `npx expo start`, permitiendo abrir la aplicacion en Expo Go mediante QR.

En consecuencia, la Mobile App se integra al ecosistema de despliegue como un cliente adicional del backend, pero no como un artefacto empaquetado para publicacion en store en esta fase del proyecto.

## Desarrollo local
### Backend local + Web
```bash
API_BASE_URL=http://localhost:4000/api npm run generate:env
```
Abrir `frontend/webV2/Login_Register/Login.html` y probar contra el backend local en `http://localhost:4000/api`.

### Mobile con backend remoto
```bash
EXPO_PUBLIC_API_URL=https://<tu-api>.onrender.com/api npx expo start
```

### Mobile con backend local
Si se desea probar contra backend local, la URL debe ser accesible desde el dispositivo o emulador. Por ejemplo, usando la IP local de la maquina:
```bash
EXPO_PUBLIC_API_URL=http://192.168.X.X:4000/api npx expo start
```

## Comprobaciones finales
### Web App
- Revisar en el navegador el panel Network al iniciar sesion o registrarse.
- Las requests deben salir a `https://<tu-netlify>/api/...` y responder desde Render.
- Verificar respuestas 200/201 en login, registro, perfiles y modulos principales.

### Backend API
- Revisar logs de Render sin errores de conexion a base de datos.
- Probar endpoints como:
  - `/api/users`
  - `/api/auth/login`
  - `/api/guides`
  - `/api/attractions`
  - `/api/community/posts`

### Mobile App
- Confirmar que Expo Go abre correctamente la app desde el QR.
- Verificar que la app puede iniciar sesion contra Render.
- Validar que las pantallas principales cargan datos remotos correctamente.
- Confirmar que el token se envia en requests autenticadas.

## Mantenimiento futuro
Si cambia la URL del backend, solo se debe actualizar:
- `API_BASE_URL` en Netlify para la Web App.
- `EXPO_PUBLIC_API_URL` en la Mobile App.
- Opcionalmente, el target del proxy en `netlify.toml`.

De esta forma, Web y Mobile siguen compartiendo el mismo backend sin necesidad de hardcodear dominios en el codigo fuente.
