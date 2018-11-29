const fs = require('fs')

const NS = require('node-sdl2')
const App = NS.app
const Window = NS.window
const KB = require('../../keyboard/default')

let errlog = fs.createWriteStream('.log')
process.stderr.write = errlog.write.bind(errlog)

module.exports = {
    fb: null,
    w: 0,
    h: 0,
    win: null,
    vpx: 4,
    fps: 20,

    init(opt) {
        let m = this

        m.w = opt.width
        m.h = opt.height
        m.bpp = opt.bpp
        m.fb = Buffer.alloc((m.w * m.h), 0)

        let winopt = {w: m.w*m.vpx, h: m.h*m.vpx, resizable: false, background: 0x0}
        m.win = new Window(winopt)

        m.win.on('close', () => {
            App.quit()
        })
        m.win.on('keydown', (key) => {
            KB.send(key.scanname.toLowerCase())
        })

        setInterval(() => {
            m.win.render.present()
        }, 1000/m.fps)
        console.log('init display')
        return this
    },

    update(offs, value) {
        let m = this
        offs *= 8

        let render = m.win.render
        let size = render.outputSize

        for (let i = 0; i < 8; i++) {
            let n
            if (value & (1 << (7 - i)))
                n = 1
            else
                n = 0

            y = Math.floor(offs / m.w)
            x = offs % m.w + i
            if (n != m.fb[offs + i]) {
                render.color = n == 1 ? 0xffffff : 0x0
                color = n == 1 ? 0xffffff : 0x0
                render.fillRect([[x*m.vpx, y*m.vpx, m.vpx, m.vpx]])
            }

            m.fb[offs + i] = n
        }
    },

}
