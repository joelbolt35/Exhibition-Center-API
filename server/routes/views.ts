import express = require('express');

const router: express.Router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

export default router;