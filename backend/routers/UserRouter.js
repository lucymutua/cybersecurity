import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, iniciarSesion, registrarUsuario  } from '../controllers/UserController.js';
import { apiLimiter, authenticateTokenAndCheckUserRole,  loginLimiter, generateToken, requireAdmin } from '../middleware/middlewares.js';

const UserRouter = express.Router();

console.log(generateToken)
UserRouter.post('/login', iniciarSesion, generateToken);

UserRouter.post('/register', registrarUsuario);

UserRouter.get('/', apiLimiter,  authenticateTokenAndCheckUserRole, requireAdmin, getUsers);

UserRouter.get('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, getUserById);

UserRouter.put('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, updateUser);

UserRouter.delete('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, deleteUser);

export default UserRouter;

