import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRoutes.js';
import { testConnection } from './config/ConnectDatabase.js';

process.loadEnvFile();
const PORT = process.env.API_PORT ?? 4000;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);

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