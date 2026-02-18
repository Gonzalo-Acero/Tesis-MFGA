# Despliegue MFGA: Render (API) + Netlify (frontend)

## Resumen rápido
- La API vive en Render y expone `/api`.
- El frontend (Netlify) genera `frontend/webV2/env.js` con `API_BASE_URL` y usa proxy `/api/*` → Render.
- Todo se configura vía variables de entorno, sin dominios hardcodeados en HTML/JS.

## Render (API)
1) Variables de entorno (Dashboard → Environment / Secret file):
   - Obligatorias:  
     - `DATABASE_URL` (cadena completa a Postgres)  
     - `DB_SSL=true`  
     - `API_PORT=4000`
   - Opcionales (performance): `DB_POOL_MAX` (default 10), `DB_IDLE_TIMEOUT` (30), `DB_CONNECT_TIMEOUT` (30).
   - Correo (si usas mailer): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
   - URLs para mails: `APP_BASE_URL=https://<tu-api>.onrender.com/api`, `FRONTEND_LOGIN_URL=https://<tu-netlify>/Login_Register/Login.html`.
2) Start command: `node index.js` (ya lee `/etc/secrets/.env` en Render y `.env` local en dev).
3) Servicio web: deploy standard en Render; la API quedará en `https://<tu-api>.onrender.com/api`.

## Netlify (frontend)
1) Variables de entorno:  
   - `API_BASE_URL=https://<tu-api>.onrender.com/api`
2) Build settings:  
   - Publish directory: `frontend/webV2`  
   - Build command: `npm run generate:env` (escribe `frontend/webV2/env.js` con `API_BASE_URL`).
3) Proxy a la API: en `netlify.toml` edita la línea `to = "https://REPLACE_ME_RENDER_API.onrender.com/api/:splat"` y pon tu host real de Render.
4) Deploy el sitio; el front usará `window.__API_BASE_URL__` generado en build y el proxy `/api` del mismo dominio.

## Desarrollo local
```bash
API_BASE_URL=http://localhost:4000/api npm run generate:env
```
Abre `frontend/webV2/Login_Register/Login.html` y prueba contra tu backend local en `http://localhost:4000/api`.

## Comprobaciones finales
- Netlify: revisa en el navegador el Network al iniciar sesión/registrar: las requests deben salir a `https://<tu-netlify>/api/...` y responder desde Render (200/201).
- Render: logs sin errores de conexión a DB; prueba `/api/users` y `/api/auth/login`.
- Si cambias de backend en el futuro, sólo actualiza `API_BASE_URL` en Netlify y (opcionalmente) el target del proxy en `netlify.toml`.
