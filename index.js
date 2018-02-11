const Swim = require('./lib/swim')
const Server = require('./lib/server')

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
  process.exit(1)
});

async function start(options, plugins, routes) {
  const server = await Server.start(options.server, plugins, routes)
  await Swim.start(options.swim, server)
}

module.exports = {
  start
}