import express from 'express';
import users from './users.js';
import authentication from './authentication.js';
import homework from './homework.js';
import lessons from './lessons.js';
import classList from './classList.js';

const router = express.Router();

router.use('/users', users);

router.use('/auth', authentication);

router.use('/homework', homework);

router.use('/lessons', lessons);

router.use('/classList', classList);

router.use('/classes', classes);


export default router;
