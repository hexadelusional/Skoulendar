import express from 'express';
import users from './users.js';
import authentication from './authentication.js';

const router = express.Router();

router.use('/users', users);

router.use('/auth', authentication);

export default router;
