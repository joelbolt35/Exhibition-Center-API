import express from 'express';
import bunyan from 'bunyan';

import AuthModel from '../../models/AuthModel';
import CookiesModel from '../../models/CookiesModel';

const logger = bunyan.createLogger({name: 'views'});
const router: express.Router = express.Router();

router.get('/', (req, res) => {
  logger.info("'/' Fetching index page");
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  logger.info("'/login' Fetching login page");
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  const user = req.body as AuthModel;
  logger.info(user, "POST /login");
  if (!user.email) {
    logger.info("POST /login - Missing Email");
    return res.render('pages/login', {
      error: "Missing Email"
    });
  }
  if (!user.password) {
    logger.info("POST /login - Missing Password");
    return res.render('pages/login', {
      error: "Missing Password"
    });
  }

  if (user.password === "invalid") {
    logger.info("POST /login - Invalid Password");
    return res.render('pages/login', {
      error: "Invalid password"
    });
  }

  res.cookie("user", { email: user.email });

  logger.info("POST /login - Success. Redirect '/'");
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  const cookies = req.cookies as CookiesModel;
  if (Object.keys(cookies.user).length !== 0) {
    logger.info(cookies.user, "'/logout' Clearing cookies. Fetching login page");
    res.clearCookie("user");
  }
  else {
    logger.info("'/logout' Nobody was logged in. Fetching login page");
  }

  res.redirect("/");
});

export default router;