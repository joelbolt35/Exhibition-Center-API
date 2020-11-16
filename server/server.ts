import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import apiRouter from './routes/api';
import viewsRouter from './routes/views';

const app: express.Application = express();

// Enables express to read form values
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enables express to read cookies
app.use(cookieParser());
app.use(express.static(__dirname + 'server/views'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Setup the routes

// Get the current user and set the res.locals.user and res.user objects so that
// all routes and all templates have access to the current user.
app.get('*', (req, res, next) => {
  // TODO: Get logged in user from session ID
  const emailCookie = req.cookies.user;

  if (emailCookie) {
    const user = {
      email: emailCookie,
    };
    res.locals.user = user;
  }
  next();
})

app.use('/', viewsRouter);
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`App is listening on http://localhost:${PORT}`);
});