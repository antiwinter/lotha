const GUT = require('./gut')
const log = console.error

log('welcome')

let gut = new GUT()
gut
  .connect(
    require('./keyboard'),
    require('./display')
  )
  .load({ base: './rom/base.gz', fw: './rom/nc1020.gz' }, err => {
    log('loaded', err)
    gut.reset()
    gut.run()
  })
