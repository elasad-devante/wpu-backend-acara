import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/auth/register', authController.register);
/**
 #swagger.requestBody = {
   required: true,
   schema: {$ref: "#/components/schemas/LoginRequest"};
   }
 */
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

export default router ;
