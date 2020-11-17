import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api';
import viewsRouter from './routes/views';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'server'});

const app: express.Application = express();

// Enables express to read form values
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enables express to read cookies
app.use(cookieParser());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Setup the routes

// Get the current user and set the res.locals.user and res.user objects so that
// all routes and all templates have access to the current user.
app.get('*', (req, res, next) => {
  // TODO: Get logged in user from session ID
  const emailCookie = req.cookies.user;

  if (emailCookie) {
    res.locals.user = { email: emailCookie };
  }
  next();
})

app.use('/', viewsRouter);
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  logger.info(`App is listening on port ${PORT}`);
});