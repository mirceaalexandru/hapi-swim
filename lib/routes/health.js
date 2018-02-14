async function handler ({ swim }) {
  return Object.assign({}, { members: swim.members() }, { me: swim.whoami() })
}

const healthEndpoint = {
  path: '/health',
  method: 'GET',
  handler
}

module.exports = healthEndpoint

