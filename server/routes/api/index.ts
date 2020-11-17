import express from 'express';
import potluckRouter from './potluck';

const router: express.Router = express.Router();

router.use('/potluck', potluckRouter);

export default router;
