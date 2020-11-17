import express from 'express';
import db from '../../db';
import bunyan from 'bunyan';
import { PotluckModel } from '../../models';

const logger = bunyan.createLogger({name: 'potluck'});
const router: express.Router = express.Router();
const currPath = "/api/potluck";

router.get('/', async (_req, res) => {
  logger.info(`GET ${currPath}`);
  try {
    const results = await db.all() as [PotluckModel];
    logger.info(`actual: ${results[0].signup_date ? results[0].signup_date.toDateString() : 'empty'}`);
    logger.info(`expected: ${Object.prototype.toString.call(new Date())}`);
    res.json(results);
    logger.info(`GET ${currPath} - Success`);
  } catch (e) {
    logger.warn(e);
    res.sendStatus(500);
  }
});


export default router;