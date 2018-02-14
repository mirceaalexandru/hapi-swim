const Call = require('call')

function init (swim) {
  async function send ({ method, path }, { logger }) {
    logger.info({ method, path }, 'Send request')

    const members = swim.members()

    members.forEach(member => {
      const router = new Call.Router()
      const { meta } = member
      if (meta.isBase) {
        return
      }
      const { routes } = meta
      Object.keys(routes).forEach(meth => {
        routes[meth].forEach(pth => {
          router.add({ method: meth, path: pth })
        })
      })

      // const rt = router.route(method, path).route
      //
      // if (rt) {
      // }
    })
  }

  return {
    send
  }
}

module.exports = init
