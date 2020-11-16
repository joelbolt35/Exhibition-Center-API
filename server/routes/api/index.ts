import express = require('express');
import potluckRouter from './potluck';

const router: express.Router = express.Router();

router.use('/potluck', potluckRouter);

export default router;