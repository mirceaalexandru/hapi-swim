const Pino = require('pino')
const Swim = require('swim');
const Config = require('./../../config')

async function start () {
  const config = await Config()
  const swimConfig = config.swim
  const logger = Pino({ level: 'debug', prettyPrint: true })

  const swim = new Swim(swimConfig);
  logger.info(swimConfig.local, 'Listen base')

  swim.bootstrap()

  // swim.on(Swim.EventType.Ready, (update) => {
  //   logger.info({ update }, 'Node change', swim.members(true))
  // });
  //
  // swim.on(Swim.EventType.Change, (update) => {
  //   logger.info({ update }, 'Node change', swim.members(true))
  // });

  // hack until a better way is found
  setInterval(() => {
    logger.debug({ members: swim.members(true) }, 'Members in network')
  }, 10 * 60 * 1000)
}

start()
