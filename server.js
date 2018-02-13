const server = require('./index')
const Config = require('./config/default')

async function start() {
  const config = await Config()
  await server.start(
    config,
    []
  )
}

start()