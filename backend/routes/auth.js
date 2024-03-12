import express from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router(); // this will allow express to identify this routs configure and organize

router.post("/login", login);

export default router;