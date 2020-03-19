const ora = require('ora')
const fs = require('fs')
const chalk = require('chalk')
const api = require('../utils/api')
const config = require('../utils/config.json')

exports.command = 'submit <problem>'
exports.desc = 'Submit solution to LeetCode'
exports.builder = function(yargs) {
    return yargs
            .option('l', {
                alias:    'lang',
                type:     'string',
                default: 'cpp',
                describe: 'Language'
            })
            .option('f', {
                alias:    'file',
                type:     'string',
                default: 'sol.cpp',
                describe: 'Name of File'
            })
            .positional('problem', {
                type:     'string',
                default:  '',
                describe: 'Question Title',
            })
            .example(chalk.yellow('leetcode submit two-sum -l cpp -f test.cpp'), 'Submit Custom File')
}
exports.handler = async (args) => {
    const spinner = ora('Submitting Question').start()
    try {
        titleSlug = args.problem
        file = args.f || 'sol.cpp'
        lang = args.l || 'cpp'

        const problem = await api.getProblem(titleSlug)

        fs.readFile(config.dir + titleSlug + '/' + file, "utf-8", async function(err, data) {
            if(err)throw Error(err)
            api.submit(problem, data, lang, function(response){
                spinner.stop()
                console.log(response)
            })
        });
    } catch (err) {
        spinner.stop()
        console.error(chalk.redBright.bold('Ran into some error! Try Again.'))
    }
}