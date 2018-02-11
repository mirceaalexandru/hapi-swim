const Swim = require('swim');
const opts = {
  local: {
    host: 'localhost:12000',
    meta: {isBase: true} // optional
  },
  codec: 'msgpack', // optional
  disseminationFactor: 15, // optional
  interval: 100, // optional
  joinTimeout: 200, // optional
  pingTimeout: 20, // optional
  pingReqTimeout: 60, // optional
  pingReqGroupSize: 3, // optional
  suspectTimeout: 60, // optional
  udp: {maxDgramSize: 512}, // optional
  preferCurrentMeta: true // optional
};
const swim = new Swim(opts);

swim.bootstrap()

swim.on(Swim.EventType.Ready, function onReady() {
  swim.on(Swim.EventType.Change, function onChange(update) {
    console.log({ update }, 'Node change', status())
  });
  // update on membership, e.g. node recovered or update on meta data
  swim.on(Swim.EventType.Update, function onUpdate(update) {
    console.log({ update }, 'Node update', status())
  });
});

function status() {
  return swim.members(true, true)
}