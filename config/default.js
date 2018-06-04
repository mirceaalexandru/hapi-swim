const dgram = require('dgram');

async function getAvailablePort (startingAt) {
  function getNextAvailablePort (currentPort, cb) {
    const server = dgram.createSocket('udp4');
    server.bind(currentPort);

    server.on('listening', () => {
      server.close();
      cb(currentPort)
    });

    server.on('error', () => {
      currentPort += 1
      return getNextAvailablePort(currentPort, cb)
    });
  }

  return new Promise(resolve => {
    getNextAvailablePort(startingAt, resolve)
  })
}

async function getConfig () {
  return {
    server: {
      port: 0,
      host: '0.0.0.0',
      externalHost: '0.0.0.0'
    },
    swim: {
      local: {
        host: `0.0.0.0:${await getAvailablePort(4444)}`
      },
      connectToBase: ['localhost:12000'],
      codec: 'msgpack',
      disseminationFactor: 15,
      interval: 100,
      joinTimeout: 200,
      pingTimeout: 20,
      pingReqTimeout: 60,
      pingReqGroupSize: 3,
      suspectTimeout: 60,
      udp: { maxDgramSize: 1024 },
      preferCurrentMeta: true
    }
  }
}

module.exports = getConfig
