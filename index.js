const SwimRouter = require('./lib/router')
const HapiPino = require('hapi-pino')
const Swim = require('./lib/swim')
const Server = require('./lib/server')

async function healthHandler(request, h) {
  const swim = request.swim

  await request.swimRouter.send({method: 'get', path: '/malex'}, request)
  await request.swimRouter.send({method: 'get', path: '/test'}, request)
  await request.swimRouter.send({method: 'get', path: '/non-existing'}, request)
  return Object.assign({}, {members: swim.members()}, {me: swim.whoami()})
};

const healthEndpoint = {
  path: '/health',
  method: 'GET',
  handler: healthHandler
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
  process.exit(1)
});

const internals = {}

async function start(options, plugins) {
  const defaultPlugins = [
    HapiPino
  ]
  const registerPlugins = plugins.concat(defaultPlugins)
  const server = await Server.start(options.server, registerPlugins)
  server.route(healthEndpoint)
  await Swim.start(options.swim, server)
  server.decorate('request', 'swim', Swim.instance())
  server.decorate('request', 'swimRouter', SwimRouter(Swim.instance()))
}

module.exports = {
  start,
  server: internals.server
}