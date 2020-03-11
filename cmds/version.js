const { version } = require('../package.json')

module.exports = (argv) => {
  console.log(`v${version}`)
}