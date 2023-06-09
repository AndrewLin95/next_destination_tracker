import express from 'express';
import { signUp, logIn, test } from '../controller/authController';
const router = express.Router();

router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/test', test)


export default router