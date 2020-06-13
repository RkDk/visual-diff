const { getDiff } = require('./utils');

function setupRoutes (server) {
  server.get('/', (request, response) => {
    response.render('Main');
  });

  server.post('/diff', (request, response) => {
    const { lBody, rBody } = request.body;
    const diff = getDiff(lBody, rBody);
    response.status(200).json(diff);
  });
}

module.exports = setupRoutes;
