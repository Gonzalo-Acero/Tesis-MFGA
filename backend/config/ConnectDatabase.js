import { Sequelize } from 'sequelize'; // Importa Sequelize desde sequelize

// Lee la configuración de las variables de entorno (recomendado para producción)
process.loadEnvFile();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // O 'postgres', 'sqlite', 'mariadb', etc.
    port: process.env.DB_PORT || 3306, // Puerto predeterminado de MySQL
    dialectOptions: {
      // Opciones específicas del dialecto (por ejemplo, para MySQL)
      dateStrings: true,
      typeCast: true
    },
    timezone: '-03:00', // Configura tu zona horaria (Buenos Aires)
    logging: console.log, // Muestra las consultas SQL en la consola (útil para desarrollo)
    // logging: false, // Desactiva el logging de SQL en producción
    pool: {
      max: 5, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo en milisegundos para intentar obtener una conexión
      idle: 10000 // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

export { sequelize };