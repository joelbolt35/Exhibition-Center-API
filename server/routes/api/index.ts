import express = require('express');
import potluckRouter from './potluck';
import authRouter from './auth';

const router: express.Router = express.Router();

router.use('/potluck', potluckRouter);
router.use('/auth', authRouter);

export default router;