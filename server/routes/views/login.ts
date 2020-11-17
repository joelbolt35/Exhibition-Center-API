import express from 'express';
import bunyan from 'bunyan';
import { AuthModel } from '../../models';

const logger = bunyan.createLogger({name: 'views'});
const router: express.Router = express.Router();
const currPath = "/login";
const viewPath = "pages/login";

router.get('/', (_req, res) => {
  logger.info(`'${currPath}' Fetching ${viewPath}`);
  res.render(viewPath);
});

router.post('/', (req, res) => {
  const user = req.body as AuthModel;
  logger.info(user, `POST ${currPath}`);
  if (!user.email) {
    logger.info(`POST ${currPath} - Missing Email`);
    return res.render(viewPath, {
      error: "Missing Email",
      ...user
    });
  }
  if (!user.password) {
    logger.info(`POST ${currPath} - Missing Password`);
    return res.render(viewPath, {
      error: "Missing Password",
      ...user
    });
  }

  if (user.password === "invalid") {
    logger.info(`POST ${currPath} - Invalid Password`);
    return res.render(viewPath, {
      error: "Invalid password",
      ...user
    });
  }

  res.cookie("user", { email: user.email });

  logger.info(`POST ${currPath} - Success. Redirect '/'`);
  return res.redirect("/");
});

export default router;