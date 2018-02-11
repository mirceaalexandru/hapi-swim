const Swim = require('swim');

const internals = {}

function getMeta(server) {
  const table = server.table();
  const routes = {}
  table.forEach(route => {
    routes[route.method] = routes[route.method] || []
    routes[route.method].push(route.path)
  });

  return {
    routes,
    server: {
      host: server.info.host,
      port: server.info.port
    }
  }
}

function start(options, server) {
  internals.options = options
  const logger = internals.logger = server.logger()
  internals.routes = {}

  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, options)
    opts.local.meta = getMeta(server)

    const swim = new Swim(opts);
    const hostsToJoin = ['localhost:12000'];

    swim.bootstrap(hostsToJoin);

    swim.on(Swim.EventType.Error, function onError(err) {
      logger.error({ err }, 'Error joining network')
      return reject()
    });

    swim.on(Swim.EventType.Ready, function onReady() {
      logger.debug('Node ready')

      logger.info(swim.whoami());
      logger.info(swim.members());
      logger.info(swim.checksum());

      // change on membership, e.g. new node or node died/left
      swim.on(Swim.EventType.Change, function onChange(update) {
        logger.debug({update}, 'Node change')
      });

      // update on membership, e.g. node recovered or update on meta data
      swim.on(Swim.EventType.Update, function onUpdate(update) {
        logger.debug({update}, 'Node update')
      });

      return resolve()
    });
  })
}

module.exports = {
  start
}
