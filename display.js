const ansi = require('ansi')
const cursor = ansi(process.stdout)
const fs = require('fs')

let errlog = fs.createWriteStream('.log')
process.stderr.write = errlog.write.bind(errlog)

module.exports = {
  fb: null,
  c: [' ', '▀', '▄', '█'],
  w: 0,
  h: 0,
  init(opt) {
    let m = this

    m.w = opt.width
    m.h = opt.height
    m.bpp = opt.bpp
    m.fb = Buffer.alloc((m.w * m.h) / 2)

    cursor.eraseData(2)
    // console.log('init display')
    return this
  },

  update(offs, value) {
    let m = this
    offs *= 8
    let fbOffs = (offs % m.w) + m.w * Math.floor(offs / (m.w * 2))
    let old8 = m.fb.slice(fbOffs, fbOffs + 8)

    let highLow = Math.floor(offs / m.w) & 1

    for (let i = 0; i < 8; i++) {
      let n
      if (value & (1 << (7 - i))) n = highLow ? old8[i] | 2 : old8[i] | 1
      else n = highLow ? old8[i] & 1 : old8[i] & 2

      if (n != old8[i]) {
        let x = ((fbOffs + i) % m.w) + 1
        let y = Math.floor((fbOffs + i) / m.w) + 1

        if (x == 1 /* || (y == 1 && !highLow) */) continue
        cursor
          .goto(x, y)
          .write(m.c[n])
          .flush()
      }

      // console.log(
      //   'updating lcd',
      //   offs,
      //   value,
      //   fbOffs + i,
      //   ((fbOffs + i) % m.w) + 1,
      //   Math.floor((fbOffs + i) / m.w),
      //   m.fb
      // )
      m.fb[fbOffs + i] = n
    }
  }
}
