const Request = require('request-promise-native')

function init (serviceConfiguration, Router, logger) {
  const request = Request.defaults({
    json: true
  })

  async function sendRequest ({ method, path, payload }) {
    const service = await Router.lookup({ method, path }, logger)
    if (!service) {
      logger.error({ method, path }, 'Cannot find matching service for reqeust')
      throw new Error('Cannot find matching service for reqeust')
    }

    const servicePath = `http://${service.meta.server.host}:${service.meta.server.port}${path}`
    const options = {
      headers: {
        'x-service': serviceConfiguration.name || 'N/A'
      },
      method,
      uri: servicePath,
      body: payload
    }

    logger.info(options, 'Send service request')

    return request(options)
  }

  return {
    sendRequest
  }
}

module.exports = init
