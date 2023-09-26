import express from 'express';
import { createForm, getForms, getFormById, updateForm, deleteForm, processForm } from '../controllers/FormController.js';
import { apiLimiter, authenticateTokenAndCheckUserRole,  requireAdmin } from '../middleware/middlewares.js';

const FormRouter = express.Router();

// Ruta para procesar el formulario y verificar reCAPTCHA
FormRouter.post('/process-Form',processForm);


FormRouter.post('/',  createForm);
FormRouter.get('/', apiLimiter, authenticateTokenAndCheckUserRole, getForms);
FormRouter.get('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin , getFormById);
FormRouter.put('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, updateForm);
FormRouter.delete('/:id', apiLimiter, authenticateTokenAndCheckUserRole, requireAdmin, deleteForm);

export default FormRouter;


