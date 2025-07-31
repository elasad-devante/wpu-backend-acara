import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/auth/register', authController.register);
/**
 #swagger.requestBody = {
   required: true,
   schema: {$ref: "#/components/schemas/LoginRequest"}
   }
 */
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);
/**
 #swagger.requestBody = {
   required: true,
   schema: {$ref: "#/components/schemas/ActivationRequest"};
   }
 */
router.post('/auth/activation', authController.activation);


export default router ;