import express from 'express';
import { signUp, logIn, verifyToken, test } from '../controller/authController';
const router = express.Router();

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/verifytoken', verifyToken)
router.get('/test', test)


export default router