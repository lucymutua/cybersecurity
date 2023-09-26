import { validationResult } from 'express-validator';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { generateToken } from '../middleware/middlewares.js';
import { secretKey } from '../config.js';


export const registrarUsuario = async (req, res) => {
  const { username, email, name, password, role } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      name,
      password: hashedPassword, 
      role 
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, secretKey, {
      expiresIn: '24h' // 24 horas de validez
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// Controlador para obtener todos los usuarios
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users); 
    
  } catch (error) {
    next(error);
    return
  }
};

// Controlador para obtener un usuario por ID
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
    if (!user) {
      
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar un usuario por ID
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

// Controlador para eliminar un usuario por ID
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).json( {message: "Usuario eliminado correctamente"});
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

// Controlador para iniciar sesión
export const iniciarSesion = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Busca al usuario en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const esPasswordValida = await bcrypt.compare(password, user.password);
    console.log(esPasswordValida, user.password, password)
    if (!esPasswordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
    next()

    // Genera un token JWT para la autenticación
   /* const token = generateToken({ _id: user._id, name: user.name, role: user.role });

    res.status(200).json({ token });*/
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};