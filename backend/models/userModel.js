import { DataTypes } from 'sequelize'; // Importa DataTypes desde sequelize
import { sequelize } from '../config/ConnectDatabase.js'; // Importa la instancia de Sequelize desde tu archivo de configuración
//import { sequelize } from './config/ConnectDatabase.js'; // Importa la instancia de Sequelize desde tu archivo de configuración
//const sequelize = require('./config/database'); // Asumiendo que configuraste Sequelize en config/database.js

const User = sequelize.define('User', {
    // Define los atributos de la tabla 'Users' (Sequelize pluraliza el nombre del modelo por defecto)
  UserId: {
    type: DataTypes.INTEGER, // Usar DataTypes.INTEGER para enteros
    primaryKey: true, // Define la clave primaria
    autoIncrement: true // Auto-incrementar el ID
  },
  // Define los atributos de la tabla 'Users' (Sequelize pluraliza el nombre del modelo por defecto)
  Name: {
    type: DataTypes.STRING,
    allowNull: false // Equivalente a required: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Puedes agregar restricciones como unique
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true // Equivalente a required: false
  },
  CreationDate: {
    type: DataTypes.DATE // Usar DataTypes.DATE para fechas
  },
  LastLogin: {
    type: DataTypes.DATE
  },
  IsActive: {
    type: DataTypes.BOOLEAN // Usar DataTypes.BOOLEAN para valores booleanos
  }
}, {
  // Opciones adicionales del modelo (opcional)
  tableName: 'user', // Puedes especificar el nombre de la tabla si no quieres la pluralización automática
  timestamps: false // Si no quieres las columnas createdAt y updatedAt automáticas
});

// Sincroniza el modelo con la base de datos (crea la tabla si no existe)
// ¡Cuidado! { force: true } eliminará la tabla existente
User.sync({ force: false }).then(() => { 
    console.log('Tabla de usuarios creada o ya existente.');
});

export { User };