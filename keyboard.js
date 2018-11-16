var keypress = require('keypress')

const code = {
  return: 29,
  left: 63,
  up: 26,
  right: 31,
  down: 27,
  0: 60,
  a: 40,
  b: 52,
  c: 50,
  d: 42,
  e: 34,
  f: 43,
  g: 44,
  h: 45,
  i: 39,
  j: 46,
  k: 47,
  l: 25,
  m: 54,
  n: 53,
  o: 24,
  p: 28,
  q: 32,
  r: 35,
  s: 41,
  t: 36,
  u: 38,
  v: 51,
  w: 33,
  x: 49,
  y: 37,
  z: 48,
  f1: 16,
  f2: 17,
  f3: 18,
  f4: 19,
  f5: 8, // time
  f6: 9, // rem
  f7: 10, // data
  f8: 11, // dict
  f9: 12, // card
  f10: 13, // calc
  f11: 14, // net
  f12: 2, // power
  '=': 62,
  '.': 61
}

module.exports = {
  pad: null,
  init(pad) {
    let m = this
    m.pad = pad

    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin)

    // listen for the "keypress" event
    process.stdin.on('keypress', function(ch, key) {
      let c

      if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause()
        process.exit()
      }

      if (key && key.name in code) {
        c = code[key.name]
      } else if (ch in code) {
        c = code[ch]
      } else {
        return
      }

      m.pad[c & 0x07][c >> 3] = 1
      setTimeout(() => {
        m.pad[c & 0x07][c >> 3] = 0
      }, 200)
    })

    process.stdin.setRawMode(true)
    process.stdin.resume()
  }
}
