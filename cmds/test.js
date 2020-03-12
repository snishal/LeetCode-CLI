const ora = require('ora')
const fs = require('fs')
const api = require('../utils/api')
const config = require('../utils/config.json')

module.exports = async (args) => {
    const spinner = ora('Testing Question').start()
    try {
        titleSlug = args._[1] || 'two-sum'
        file = args.f || '1.cpp'

        const problem = await api.getProblem(titleSlug)

        problem.sampleTestCase = args.t || problem.sampleTestCase

        console.log(problem.sampleTestCase)

        fs.readFile(config.dir + titleSlug + '/' + file, "utf-8", async function(err, data) {
            api.test(problem, data, function(){
                spinner.stop()
            })
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}