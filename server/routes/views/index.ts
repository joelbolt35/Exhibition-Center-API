import express = require('express');

const router: express.Router = express.Router();

interface userLogin {
  email: String,
  password: String
}

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.use('/login', (req, res) => {
  if (req.method === 'GET') return res.render('pages/login');
  if (req.method === 'POST') {
    let user = {} as userLogin;
    user.email = req.body.email;
    user.password = req.body.password;
    if (!user.email)
      return res.render('pages/login', {
        error: "Missing Email"
      });
    if (!user.password)
      return res.render('pages/login', {
        error: "Missing Password"
      });

    console.log("Logging in with " + user.email + " and " + user.password);

    if (user.password === "invalid") {
      return res.render('pages/login', {
        error: "Invalid password"
      });
    }

    res.cookie("user", user.email);
    res.redirect("/");
  }
  return res.sendStatus(404);
});

router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

export default router;