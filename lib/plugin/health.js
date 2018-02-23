const pkg = require('./../../package.json')

exports.plugin = {
  register: server => {
    server.route({
      path: '/health',
      method: 'GET',
      handler: (request) => {
        return request.server.swim.status()
      }
    })
  },
  pkg
}
