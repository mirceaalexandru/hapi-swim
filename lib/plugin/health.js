const pkg = require('./../../package.json')

exports.plugin = {
  register: server => {
    server.route({
      path: '/health',
      method: 'GET',
      handler: ({ swim }) => {
        return swim.status()
      }
    })
  },
  pkg
}
