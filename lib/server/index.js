const Hapi = require('hapi');

async function start ({ host, port }, plugins) {
  const server = new Hapi.Server({
    port,
    host
  });

  try {
    await server.register(plugins)

    await server.start()
    server.logger().info(`Server running at: ${server.info.uri}`);
    return server
  } catch (err) {
    throw err;
  }
}

module.exports = {
  start
}
