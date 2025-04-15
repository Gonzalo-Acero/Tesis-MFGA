import { Router } from "express";
import { getUsers, getUserById, addUser, updateUser, deleteUser } from '../controllers/userControllers.js';

const userRouter = Router();

    userRouter.get('/', getUsers);

    userRouter.get('/:id', getUserById);

    userRouter.post('/', addUser);
    
    userRouter.patch('/:id', updateUser);
    
    userRouter.delete('/:id', deleteUser);

export { userRouter };