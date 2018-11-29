const GUT = require('./gut')
const keyboard = require('./io/keyboard/default')
const display = require('./io/display/di-braille')
const log = console.error

log('welcome')

let gut = new GUT()
gut
  .connect(
    keyboard,
    display
  )
  .load({ base: './rom/base.gz', fw: './rom/nc1020.gz' }, err => {
    log('loaded', err)
    gut.reset()
    gut.run()
  })

setTimeout(() => {
  keyboard.send('f11', () => {
    keyboard.send('return', () => {
      setTimeout(() => {
        keyboard.send('return')
      }, 200)
    })
  })
}, 4000)
