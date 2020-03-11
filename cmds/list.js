const ora = require('ora')
const api = require('../utils/api')

module.exports = async (args) => {
    const spinner = ora('Loading Questions').start()
    try {
        const problems = await api.getProblems()

        spinner.stop()

        console.log(problems)
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}