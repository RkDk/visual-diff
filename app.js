const express = require('express');
const bodyParser = require('body-parser');
const setupRoutes = require('./routes');

const { DEFAULT_PORT } = require('./constants');
const PORT = process.env.PORT || DEFAULT_PORT;

function initServer () {
  const server = express();

  server.set('view engine', 'pug');

  server.listen(PORT, () => {
    console.log('Http server listening on port ' + PORT);
  });

  server.use(express.static('static'));
  server.use(bodyParser.json());

  setupRoutes(server);
}

initServer();
