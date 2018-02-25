const Server = require('./index')

async function start () {
  const server = await Server.start({
    server: {
      serviceHost: '92.168.1.1'
    },
    service: {
      name: 'test-service'
    }
  })

  await server.serviceConnection.sendRequest({
    method: 'post',
    path: '/audit',
    payload: {
      who: 'malex',
      what: {
        operation: 'test',
        entity: 'none',
        id: '123',
        details: 'none'
      },
      when: new Date(),
      where: 'here'
    }
  }).catch(err => {
    server.logger(err)
  })
}

start()
