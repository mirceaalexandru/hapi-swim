async function handler ({ swim }) {
  return swim.status()
}

const healthEndpoint = {
  path: '/health',
  method: 'GET',
  handler
}

module.exports = healthEndpoint

