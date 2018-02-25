const pino = require('pino')()
const Swim = require('swim');
const Config = require('./../../config')

async function start () {
  const config = await Config()
  const swimConfig = config.swim

  const swim = new Swim(swimConfig);
  pino.info(swimConfig.local, 'Listen base')

  swim.bootstrap()

  swim.on(Swim.EventType.Ready, (update) => {
    pino.debug({ update }, 'Node change', swim.members(true))
  });

  swim.on(Swim.EventType.Change, (update) => {
    pino.debug({ update }, 'Node change', swim.members(true))
  });
}

start()
