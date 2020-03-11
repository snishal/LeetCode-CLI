const ora = require('ora')
const api = require('../utils/api')

module.exports = async (args) => {
    const spinner = ora('Testing Question').start()
    try {
        await api.test()

        spinner.stop()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}