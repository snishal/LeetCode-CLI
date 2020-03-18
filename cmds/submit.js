const ora = require('ora')
const fs = require('fs')
const api = require('../utils/api')
const config = require('../utils/config.json')

exports.command = 'submit'
exports.desc = 'Submit solution to LeetCode'
exports.handler = async (args) => {
    const spinner = ora('Submitting Question').start()
    try {
        titleSlug = args._[1] || 'two-sum'
        file = args.f || '1.cpp'
        lang = args.l || 'C++'

        const problem = await api.getProblem(titleSlug)

        fs.readFile(config.dir + titleSlug + '/' + file, "utf-8", async function(err, data) {
            api.submit(problem, data, lang, function(){
                spinner.stop()
            })
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}