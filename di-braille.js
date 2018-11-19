const Canvas = require('drawille')
const fs = require('fs')
const ansi = require('ansi')
const cursor = ansi(process.stdout)
const cliCursor = require('cli-cursor')

let errlog = fs.createWriteStream('.log')
process.stderr.write = errlog.write.bind(errlog)

module.exports = {
  fb: null,
  w: 0,
  h: 0,
  init(opt) {
    let m = this

    m.w = opt.width
    m.h = opt.height
    m.bpp = opt.bpp
    m.fb = Buffer.alloc((m.w * m.h) / 8)

    m.cv = new Canvas(m.w, m.h)
    m.cv.clear()

    cliCursor.hide(process.stdout)

    cursor.eraseData(2)
    // console.log('init display')

    setInterval(() => {
      cursor.goto(1, 1).write(m.cv.frame())
    }, 100)
    return this
  },

  update(offs, value) {
    let m = this
    let change = value ^ m.fb[offs]
    let x = (offs % 20) * 8
    for (let i = 0; i < 8; i++)
      if (change & (1 << (7 - i))) {
        // console.log('toggling', x + i, Math.floor(offs / 20))
        m.cv.toggle(x + i, Math.floor(offs / 20))
      }
    m.fb[offs] = value
  }
}
