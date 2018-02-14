const Request = require('./lib/request')
const Router = require('./lib/router')
const HapiPino = require('hapi-pino')
const Swim = require('./lib/swim')
const Server = require('./lib/server')
const Health = require('./lib/routes/health')

process.on('unhandledRejection', err => {
  console.log('unhandledRejection', { err, message: err.message });// eslint-disable-line
  throw err
});

const internals = {}

async function start (options, plugins = []) {
  const defaultPlugins = [
    HapiPino
  ]

  const registerPlugins = plugins.concat(defaultPlugins)
  const server = await Server.start(options.server, registerPlugins)
  server.route(Health)

  await Swim.start(options.swim, server)

  server.decorate('request', 'swim', Swim)
  server.decorate('request', 'serviceConnection', Request(Router(Swim, server.logger())))
}

module.exports = {
  start,
  server: internals.server
}
