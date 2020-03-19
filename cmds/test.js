const ora = require('ora')
const fs = require('fs')
const api = require('../utils/api')
const config = require('../utils/config.json')

exports.command = 'test'
exports.desc = 'Test solution on LeetCode'
exports.handler = async (args) => {
    const spinner = ora('Testing Question').start()
    try {
        titleSlug = args._[1] || 'two-sum'
        file = args.f || '1.cpp'
        lang = args.l || 'cpp'

        const problem = await api.getProblem(titleSlug)

        problem.sampleTestCase = args.t || problem.sampleTestCase

        fs.readFile(config.dir + titleSlug + '/' + file, "utf-8", async function(err, data) {
            api.test(problem, data, lang, function(){
                spinner.stop()
            })
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}