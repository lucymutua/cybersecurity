import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';
import rateLimit from 'express-rate-limit';
import { secretKey } from '../config.js'

dotenv.config();

//const secretKey = config.secretKey;

const tokenExpirationTime = 3 * 60 * 60 * 1000; 


// Middleware para encriptar la contraseña antes de guardar
export async function encryptPasswordMiddleware(user, next) {
  try {
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10); 
      const hash = await bcrypt.hash(user.password, salt); 
      user.password = hash; 
    }
    next(); 
  } catch (error) {
    next(error); 
  }
}

// Middleware para generar token
export const generateToken = (req, next) => {
  try {
    const { _id, name, role } = req;
    const token = jwt.sign({ _id, name, role }, secretKey, {
      expiresIn: tokenExpirationTime,
    });

    req.token = token;

    return token;
  } catch (error) {
    console.error(error);
  }
};

// Middleware para autenticar token y comparar con el rol en la base de datos
export const authenticateTokenAndCheckUserRole = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const tokenPayload = jwt.verify(token.substring(7), secretKey);

    const { _id, name, role } = tokenPayload;

    // Obtener el rol del usuario desde la base de datos
    const roleFromDatabase = await User.findById(_id);

    if (!roleFromDatabase || roleFromDatabase.role !== role) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    req._id = _id;
    req.name = name;
    req.role = role;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al verificar el token' });
  }
};


// Middleware para restringir el acceso a rutas solo para usuarios "admin"
export const requireAdmin = (req, res, next) => {
  const { role } = req;

  if (role !== 'admin') {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  next();
};

/* // Middleware para restringir el acceso a rutas solo para usuarios "user" y "admin"
export const requireUser = (req, res, next) => {
  const { userRole } = req.user;

  if (userRole !== 'user' && userRole !== 'admin') {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  next();
};
 */

// Middleware para validar contraseñas
/*export function validatePasswordMiddleware(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}*/

// Middleware para manejar errores
export function errorMiddleware(error, req, res, next) {
  res.status(500).json({ message: 'Error interno del servidor' });
}

//Middleware contra posibles ataques de fuerza bruta 
// Mensajes personalizados
const formMessage = 'Demasiados formularios. Por favor, inténtelo de nuevo más tarde.'
const loginMessage = 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo más tarde.';
const apiMessage = 'Demasiadas solicitudes a la API. Por favor, espere un momento.';


// Middleware de rate limit para la ruta de inicio de sesión
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Número máximo de intentos permitidos en el período de tiempo especificado
  message: loginMessage,
});

// Middleware de rate limit para una ruta API diferente
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100, // Número máximo de solicitudes a la API en el período de tiempo especificado
  message: apiMessage,
});

// Middleware de rate limit para una ruta creacion de formulario.
export const formLimiter = rateLimit({
  windowMs: 5 * 60 * 1000 , // 5 mins
  max: 5, // Número máximo de solicitudes a la API en el período de tiempo especificado
  message: formMessage,
});