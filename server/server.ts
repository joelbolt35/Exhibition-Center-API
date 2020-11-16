import express = require('express');
import apiRouter from './routes';

// Create a new express app instance
const app: express.Application = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/api/test', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`App is listening on http://localhost:${PORT}`);
});