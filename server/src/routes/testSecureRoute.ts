import express from 'express';
import { secureTest } from '../controller/testSecureController';
const router = express.Router();

router.get('/testSecure', secureTest)

export default router