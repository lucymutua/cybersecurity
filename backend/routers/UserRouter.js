import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, iniciarSesion, registrarUsuario, processUser  } from '../controllers/UserController.js';
import { apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin } from '../middleware/middlewares.js';

const UserRouter = express.Router();

UserRouter.post('/process-User',processUser);


UserRouter.post('/login', iniciarSesion);

UserRouter.post('/register', registrarUsuario);

UserRouter.get('/', apiLimiter,  authenticateTokenAndCheckUserRole, requireAdmin, getUsers);

UserRouter.get('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, getUserById);

UserRouter.put('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, updateUser);

UserRouter.delete('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, deleteUser);

export default UserRouter;

