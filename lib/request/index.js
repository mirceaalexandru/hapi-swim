const Request = require('request-promise-native')

function init (Router) {
  const request = Request.defaults({
    json: true
  })

  function sendRequest ({ method, path, payload }, logger) {
    const service = Router.lookup({ method, path }, logger)
    if (!service) {
      logger.error({ method, path }, 'Cannot find matching service for reqeust')
      throw new Error('Cannot find matching service for reqeust')
    }

    const servicePath = `${service.host}:${service.port}/${path}`

    return request({
      method,
      path: servicePath,
      body: payload
    })
  }

  return {
    sendRequest
  }
}

module.exports = init
