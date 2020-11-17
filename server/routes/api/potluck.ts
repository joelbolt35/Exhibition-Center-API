import express from 'express';
import db from '../../db';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'potluck'});
const router: express.Router = express.Router();
const basePath = "/api/potluck";

router.get('/', async (_req, res) => {
  logger.info(`GET ${basePath}/`);
  try {
    const results = await db.all();
    logger.info(`GET ${basePath}/ - Success`);
    res.json(results);
  } catch (e) {
    logger.warn(e);
    res.sendStatus(500);
  }
});


export default router;