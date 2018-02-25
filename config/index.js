const Hoek = require('hoek')
const Dotenv = require('dotenv')
const Defaults = require('./default')
const Environment = require('./environment')

async function prepare () {
  // try to load using dotenv
  try {
    Dotenv.config({ path: '.env', silent: true })
  } catch (err) {
    // nothing to do here
  }

  return Hoek.applyToDefaults(
    await Defaults(),
    Environment.config()
  )
}

module.exports = prepare
