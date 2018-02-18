const Hapi = require('hapi');

async function start (config, plugins) {
  const { host, port } = config.server
  const server = new Hapi.Server({
    port,
    host
  });

  server.app.config = config
  await server.register(plugins)

  await server.start()
  server.logger().info(`Server running at: ${server.info.uri}`);
  return server
}

module.exports = {
  start
}
