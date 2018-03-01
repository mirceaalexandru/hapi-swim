module.exports.config = () => {
  return {
    server: {
      externalHost: process.env.EXTERNAL_HOST,
      port: process.env.SERVICE_PORT
    },
    swim: {
      connectToBase: process.env.SWIM_BASE ? process.env.SWIM_BASE.split(',') : undefined,
      local: {
        host: process.env.BASE
      }
    }
  }
}
