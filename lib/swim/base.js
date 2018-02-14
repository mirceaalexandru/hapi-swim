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
    // swim.on(Swim.EventType.Change, (update) => {
    //   console.log({ update }, 'Node change', status())
    // });
    // // update on membership, e.g. node recovered or update on meta data
    // swim.on(Swim.EventType.Update, (update) => {
    //   console.log({ update }, 'Node update', status())
    // });
  });
}

start()
