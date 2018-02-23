const Swim = require('swim');

const opts = {
  local: {
    host: 'localhost:12000',
    meta: { isBase: true }
  }
};

function start () {
  const swim = new Swim(opts);

  swim.bootstrap()

  swim.on(Swim.EventType.Ready, () => {
    swim.on(Swim.EventType.Change, (update) => {
      console.log({ update }, 'Node change', swim.members(true))
    });
  });
}

start()
