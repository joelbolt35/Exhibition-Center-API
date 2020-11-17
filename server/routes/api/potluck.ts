import express = require('express');
import db from '../../db';

const router: express.Router = express.Router();

router.get('/', async (_req, res, _next) => {
  try {
    console.log("Making DB call for potluck");
    let results = await db.all();
    console.log("Data grabbed successfully. Returning JSON");
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


export default router;