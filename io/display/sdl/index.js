const fs = require('fs')

const NS = require('node-sdl2')
const App = NS.app
const Window = NS.window
const KB = require('../../keyboard/' + global.config.keyboard)

let errlog = fs.createWriteStream('.log')
process.stderr.write = errlog.write.bind(errlog)

module.exports = {
    fb: null,
    w: 0,
    h: 0,
    win: null,
    vpx: 4, //default 4
    fps: 20, //default 20

    init(opt) {
        let m = this

        m.w = opt.width
        m.h = opt.height
        m.bpp = opt.bpp
        m.fb = Buffer.alloc((m.w * m.h), 0)

        console.log(global.config)
        m.vpx = global.config.display_config.vpx
        m.fps = global.config.display_config.fps

        let winopt = {w: m.w*m.vpx, h: m.h*m.vpx, resizable: false, background: 0x0}
        m.win = new Window(winopt)

        m.win.on('close', () => {
            App.quit()
        })
        m.win.on('keydown', (key) => {
            KB.key_event(key.scanname.toLowerCase(), true)
        })
        m.win.on('keyup', (key) => {
            KB.key_event(key.scanname.toLowerCase(), false)
        })

        setInterval(() => {
            m.drawfb()
        }, 1000/m.fps)
        console.log('init display')
        //console.log(m)
        return this
    },

    update(offs, value) {
        let m = this
        offs *= 8

        for (let i = 0; i < 8; i++) {
            m.fb[offs + i] = !!(value & (1 << (7 - i)))
        }
    },

    drawfb() {
        let m = this
        let render = m.win.render
        render.color = 0x0
        render.fillRect([[0, 0, m.w * m.vpx, m.h * m.vpx]])
        render.color = 0xffffff
        for (let x = 0; x < m.w; x++) {
            for (let y = 0; y < m.h; y++) {
                if (m.fb[y * m.w + x] ==  1) {
                    render.fillRect([[x * m.vpx, y * m.vpx, m.vpx, m.vpx]])
                }
            }
        }
        render.present()
    }

}
