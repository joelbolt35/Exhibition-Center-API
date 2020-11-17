import express from 'express';
import bunyan from 'bunyan';
import LoginRouter from './login'
import CookiesModel from '../../models/CookiesModel';

const logger = bunyan.createLogger({name: 'views'});
const router: express.Router = express.Router();
const currPath = "/";
const viewPath = "pages/index";

router.get('/', (req, res) => {
  logger.info(`'${currPath}' Fetching ${viewPath}`);
  res.render(viewPath);
});

router.use("/login", LoginRouter);

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