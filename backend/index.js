//import { ConnectDatabase } from "./config/ConnectDatabase.js";
import { sequelize } from './config/ConnectDatabase.js';
import express from 'express';
import { userRouter } from './routes/userRoutes.js';
import cors from 'cors';

const app = express();

process.loadEnvFile();
const PORT = process.env.API_PORT;

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);

    // Conexión a la base de datos
  sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada correctamente.');
}).catch((error) => { 
    console.error('Error al sincronizar la base de datos:', error);
}
);
});
