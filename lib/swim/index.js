const Swim = require('swim');

const internals = {}

function getMeta (server, options) {
  const table = server.table();
  const routes = {}
  table.forEach(route => {
    routes[route.method] = routes[route.method] || []
    routes[route.method].push(route.path)
  });

  return {
    routes,
    server: {
      service: options.service,
      host: options.server.serviceHost || server.info.host,
      port: server.info.port
    }
  }
}

function start (options, server) {
  internals.options = options
  const logger = server.logger()

  internals.routes = {}

  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, options.swim)
    opts.local.meta = getMeta(server, options)

    const swim = new Swim(opts)
    const hostsToJoin = opts.connectToBase

    internals.swim = swim
    logger.info({ hostsToJoin }, 'Trying to connect to base')
    swim.bootstrap(hostsToJoin);

    swim.on(Swim.EventType.Error, (err) => {
      logger.error({ err }, 'Error joining network')
      return reject(err)
    });

    swim.on(Swim.EventType.Ready, () => {
      return resolve()
    });
  })
}

function status () {
  return internals.swim ? internals.swim.members(true) : 'N/A'
}

function registerChangeHandler (handler) {
  internals.swim.on(Swim.EventType.Change, handler);
}

function registerUpdateHandler (handler) {
  internals.swim.on(Swim.EventType.Change, handler);
}


module.exports = {
  start,
  status,
  registerChangeHandler,
  registerUpdateHandler,
  instance: () => internals.swim
}
