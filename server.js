const Server = require('./index')

async function start () {
  const server = await Server.start({
    server: {
      serviceHost: '92.168.1.1'
    }
  })

  await server.serviceConnection.sendRequest({
    method: 'post',
    path: '/audit',
    payload: {}
  })
}

start()
