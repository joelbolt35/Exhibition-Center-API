import express from 'express';
import db from '../../db';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'potluck'});
const router: express.Router = express.Router();
const currPath = "/api/potluck";

router.get('/', async (_req, res) => {
  logger.info(`GET ${currPath}`);
  try {
    const results = await db.all();
    res.json(results);
    logger.info(`GET ${currPath} - Success`);
  } catch (e) {
    logger.warn(e);
    res.sendStatus(500);
  }
});


export default router;