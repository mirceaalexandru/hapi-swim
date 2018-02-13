const Call = require('call')

function init(swim) {
  async function send({method, path, payload}, { logger }) {
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
          console.log('Add', meth, pth)
          router.add({method: meth, path: pth})
        })
      })

      const rt = router.route(method, path).route

      if (rt) {
        console.log({method, path}, rt, meta.server)
      }
    })
  }

  return {
    send
  }
}

module.exports = init