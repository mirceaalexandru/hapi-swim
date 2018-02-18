const Request = require('./lib/request')
const Router = require('./lib/router')
const HapiPino = require('hapi-pino')
const Swim = require('./lib/swim')
const Server = require('./lib/server')
const HealthPlugin = require('./lib/plugin/health')
const Hoek = require('hoek')
const Defaults = require('./config/default')

process.on('unhandledRejection', err => {
  console.log({ err, message: err.message }, 'unhandledRejection');// eslint-disable-line
  throw err
});

const internals = {}

async function start (options, plugins = []) {
  const defaultPlugins = [
    HapiPino,
    HealthPlugin
  ]

  const config = Hoek.applyToDefaults(await Defaults(), options)

  const registerPlugins = defaultPlugins.concat(plugins)
  const server = await Server.start(config, registerPlugins)

  await Swim.start(config, server)

  server.decorate('server', 'swim', Swim)
  server.decorate(
    'server', 'serviceConnection',
    Request(
      Router(Swim, server.logger()),
      server.logger()
    )
  )

  return server
}

module.exports = {
  start,
  server: internals.server
}
