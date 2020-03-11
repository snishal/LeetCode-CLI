const ora = require('ora')
const api = require('../utils/api')

module.exports = async (args) => {
    const spinner = ora('Loading Question').start()
    try {
        const problem = await api.getProblem('two-sum')

        spinner.stop()

        console.log(problem)
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}