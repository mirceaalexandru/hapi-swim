const Swim = require('swim');

const internals = {}

function getMeta (server) {
  const table = server.table();
  const routes = {}
  table.forEach(route => {
    routes[route.method] = routes[route.method] || []
    routes[route.method].push(route.path)
  });

  return {
    routes,
    me: true,
    server: {
      host: server.info.host,
      port: server.info.port
    }
  }
}

function start (options, server) {
  internals.options = options
  const logger = server.logger()

  internals.routes = {}

  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, options)
    opts.local.meta = getMeta(server)

    const swim = new Swim(opts);
    const hostsToJoin = ['localhost:12000'];

    internals.swim = swim
    swim.bootstrap(hostsToJoin);

    swim.on(Swim.EventType.Error, (err) => {
      logger.error({ err }, 'Error joining network')
      return reject()
    });

    swim.on(Swim.EventType.Ready, () => {
      // change on membership, e.g. new node or node died/left
      swim.on(Swim.EventType.Change, (update) => {
        logger.debug({ update }, 'Node change')
      });

      // update on membership, e.g. node recovered or update on meta data
      swim.on(Swim.EventType.Update, (update) => {
        logger.debug({ update }, 'Node update')
      });

      return resolve()
    });
  })
}

function status () {
  return internals.swim ? internals.swim.members() : 'N/A'
}

module.exports = {
  start,
  status,
  instance: () => internals.swim
}
