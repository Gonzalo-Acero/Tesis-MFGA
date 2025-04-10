import mysql from 'mysql2';

function ConnectDatabase() {
process.loadEnvFile();

// Configuración de la conexión
const connection = mysql.createConnection({
  host: process.env.HOST,     // O la dirección IP de tu servidor MySQL
  user: process.env.USER,    // Tu nombre de usuario de MySQL
  password: process.env.PASSWORD, // Tu contraseña de MySQL
  database: process.env.DATABASE // El nombre de la base de datos a la que quieres conectar
});

// Intentar conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida correctamente.');

  // Aquí puedes realizar operaciones con la base de datos

  // Es importante cerrar la conexión cuando ya no la necesites
  connection.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión:', err);
    } else {
      console.log('Conexión a la base de datos cerrada.');
    }
  });
});
}
export { ConnectDatabase};