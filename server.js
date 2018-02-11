const server = require('./index')
const pino = require('hapi-pino')
const Config = require('./config/default')

function routes() {
  const healthHandler = function (request, h) {

    return 'OK'
  };

  return [{
    path: '/health',
    method: 'GET',
    handler: healthHandler
  }]
}


async function start() {
  const config = await Config()
  server.start(
    config,
    [
      pino
    ],
    routes()
  )
}

start()