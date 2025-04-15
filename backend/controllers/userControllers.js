import { User } from "../models/userModel.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log('Lista de usuarios obtenida:', users);
        // Muestra los resultados en la consola para depuración
        // Convierte los resultados a JSON y devuelve la lista de usuarios
        res.json(users);
      } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
        throw error;
      }
    
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
        res.json(user);
        } else {
          return null; // Indica que no se encontró el usuario
        }
      } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
      }
};

const addUser= async (req, res) => {
    //const userData = new User(req.body);
    try {
        const newUser = await User.create(req.body); // Crea un nuevo usuario con los datos del cuerpo de la solicitud
        // Convierte el nuevo usuario a JSON y lo devuelve en la respuesta
        res.json(newUser); // Devuelve el nuevo usuario creado
      console.log('Usuario creado:', newUser);
      } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error; // Re-lanza el error para que el llamador lo gestione
      }
}

const updateUser = async (req, res) => {   
    const { id } = req.params; // Obtiene el ID del usuario a actualizar desde los parámetros de la solicitud
    console.log('ID del usuario a actualizar:', id);
    console.log('Datos del usuario a actualizar:', req.body);
    const userData = req.body; // Crea una nueva instancia de User con los datos del cuerpo de la solicitud
    try {
        const [rowsAffected] = await User.update(userData, {
          where: { UserId: id } // Cambia 'id' por 'UserId' si es el nombre correcto de la columna en tu modelo
        });
        if (rowsAffected > 0) {
          const updatedUser = await User.findByPk(id); // Obtiene el usuario actualizado
          // Convierte el usuario actualizado a JSON y lo devuelve en la respuesta
          res.json(updatedUser); // Devuelve el usuario actualizado
          console.log('Usuario actualizado:', updatedUser);
        } else {
          res.json(null); // Indica que no se encontró el usuario o no se realizaron cambios
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
      }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const rowsDeleted = await User.destroy({
          where: { UserId: id }
        });
        res.json({"Usuario eliminado": rowsDeleted > 0}); // Devuelve true si se eliminó el usuario, false si no se encontró
        console.log('Usuario eliminado:', rowsDeleted > 0);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
      }
}

export { getUsers, getUserById, addUser, updateUser, deleteUser };