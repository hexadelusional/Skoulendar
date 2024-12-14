import express from 'express';
import users from './users.js';
import authentication from './authentication.js';
import homework from './homework.js';
import classes from './classes.js';
import classList from './classList.js';

const router = express.Router();

router.use('/users', users);

router.use('/auth', authentication);

router.use('/homework', homework);

router.use('/classes', classes);

router.use('/classList', classList);

export default router;
