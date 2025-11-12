const express = require('express');
const router = express.Router();

// mount auth
const authRouter = require('./auth');
router.use('/', authRouter);

// ensure user/admin are namespaced
const userRouter = require('./user');
router.use('/user', userRouter);

const adminRouter = require('./admin');
router.use('/admin', adminRouter);

module.exports = router;