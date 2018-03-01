const Request = require('./lib/request')
const Router = require('./lib/router')
const HapiPino = require('hapi-pino')
const Swim = require('./lib/swim')
const Server = require('./lib/server')
const HealthPlugin = require('./lib/plugin/health')
const Hoek = require('hoek')
const Config = require('./config/index')

process.on('unhandledRejection', err => {
  console.log({ err, message: err ? err.message : 'N/A'}, 'unhandledRejection');// eslint-disable-line
  process.exit(1)
});

const internals = {}

async function start (options, plugins = []) {
  const defaultPlugins = [
    HapiPino,
    HealthPlugin
  ]

  const cfg = await Config()
  const config = Hoek.applyToDefaults(cfg, options)

  const registerPlugins = defaultPlugins.concat(plugins)
  const server = await Server.start(config, registerPlugins)

  await Swim.start(config, server)

  server.decorate('server', 'swim', Swim)
  server.decorate(
    'server', 'serviceConnection',
    Request(
      config.service,
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
