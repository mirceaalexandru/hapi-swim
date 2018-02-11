const Hapi = require('hapi');

async function start({ host, port }, plugins, routes) {
  const server = new Hapi.Server({
    port,
    host
  });

  try {
    await server.register(plugins)
    routes && routes.forEach(route => {
      server.route(route)
    })
    await server.start()
    server.logger().info(`Server running at: ${server.info.uri}`);

    var table = server.table();
    table.forEach(function(route) {
      console.log(route.path, '\t', route.method)
    });

    return server
  } catch (err) {
    console.log({ err, message: err.message }, 'Error starting server')
    throw err;
  }
}

module.exports = {
  start
}