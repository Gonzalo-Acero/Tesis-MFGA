import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { guideRouter } from './routes/guideRoutes.js';
import { attractionRouter } from './routes/attractionRoutes.js';
import { communityRouter } from './routes/communityRoutes.js';
import { testConnection } from './config/ConnectDatabase.js';

process.loadEnvFile();
const PORT = process.env.API_PORT ?? 4000;

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.join(__dirname, '..', 'frontend', 'webV2');
app.use(express.static(frontendRoot));

// Swagger UI: load OpenAPI spec and serve docs at /api/docs
try {
  const openapiPath = path.join(__dirname, 'openapi-swagger-project', 'src', 'openapi', 'openapi.yaml');
  const openapiContent = fs.readFileSync(openapiPath, 'utf8');
  const openapiDocument = yaml.load(openapiContent);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
} catch (err) {
  console.warn('No OpenAPI spec found or failed to load Swagger UI:', err.message);
}

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/guides', guideRouter);
app.use('/api/attractions', attractionRouter);
app.use('/api/community', communityRouter);

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('La aplicacion no pudo iniciar por un fallo en la base de datos.');
    process.exit(1);
  }
};

startServer();
