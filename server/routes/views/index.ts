import express from 'express';

const router: express.Router = express.Router();

interface userLogin {
  email: String,
  password: String
}

router.get('/', (req, res) => {
  console.log("'route /' Fetching index page");
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  console.log("'route /login' Fetching login page");
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  let user = {} as userLogin;
  user.email = req.body.email;
  user.password = req.body.password;
  console.log(`login POST for ${user.email} : ${user.password}`);
  if (!user.email) {
    console.log(`login POST missing email`);
    return res.render('pages/login', {
      error: "Missing Email"
    });
  }
  if (!user.password) {
    console.log(`login POST missing password`);
    return res.render('pages/login', {
      error: "Missing Password"
    });
  }

  
  if (user.password === "invalid") {
    console.log("login POST password was found to be invalid");
    return res.render('pages/login', {
      error: "Invalid password"
    });
  }
  console.log(`login POST successfully logging in with for ${user.email}`);
  console.log(`login POST setting cookie to {user:${user.email}}`);
  res.cookie("user", req.body.email);

  console.log(`login POST redirect to /`);
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

export default router;