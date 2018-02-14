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
      host: '0.0.0.0'
    },
    swim: {
      local: {
        host: `0.0.0.0:${await getAvailablePort(4444)}`
      },
      codec: 'msgpack', // optional
      disseminationFactor: 15, // optional
      interval: 100, // optional
      joinTimeout: 200, // optional
      pingTimeout: 20, // optional
      pingReqTimeout: 60, // optional
      pingReqGroupSize: 3, // optional
      suspectTimeout: 60, // optional
      udp: { maxDgramSize: 512 }, // optional
      preferCurrentMeta: true // optional
    }
  }
}

module.exports = getConfig
