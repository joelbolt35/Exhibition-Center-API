import express from 'express';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'views'});
const router: express.Router = express.Router();

interface userLogin {
  email: String,
  password: String
}

router.get('/', (req, res) => {
  logger.info("'/' Fetching index page");
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  logger.info("'/login' Fetching login page");
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  let user = {} as userLogin;
  user.email = req.body.email;
  user.password = req.body.password;
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

  res.cookie("user", req.body.email);

  logger.info("POST /login - Success. Redirect '/'");
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  logger.info(`'/logout' Clearing user cookies (${req.cookies.user}) and Fetching login page`);
  res.clearCookie("user");
  res.redirect("/");
});

export default router;