import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';
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

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

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
