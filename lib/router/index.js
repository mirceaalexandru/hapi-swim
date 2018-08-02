const Call = require('call')

const internals = {
  members: {}
}

function init (swim, logger) {
  function registerRoutes () {
    const members = swim.instance().members()

    members.forEach(member => {
      createMemberMatcher(member)
    })

    swim.registerUpdateHandler(update => {
      // logger.debug({ update }, 'Received Update event')
      if (update.state === 2) {
        // died member
        delete internals.members[update.host]
      } else if (update.state === 0) {
        // new member
        createMemberMatcher(update)
      }
    })
  }

  function createMemberMatcher (member) {
    const router = new Call.Router()
    const { meta } = member
    if (!meta || meta.isBase) {
      // base doesn't expose useful endpoints
      return
    }
    const { routes } = meta
    Object.keys(routes).forEach(method => {
      routes[method].forEach(path => {
        router.add({ method, path })
      })
    })
    internals.members[member.host] = {
      router,
      config: member
    }
  }

  async function lookup ({ method, path }) {
    logger.info({ method, path }, 'Request service lookup')

    const members = Object.values(internals.members)
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      const { route } = member.router.route(method, path)

      if (route) {
        return member.config
      }
    }
    return null
  }

  registerRoutes()
  return {
    lookup
  }
}

module.exports = init
