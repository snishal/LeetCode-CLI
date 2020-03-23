const ora = require('ora')
const fs = require('fs')
const chalk = require('chalk')
const api = require('../utils/api')
const config = require('../utils/config.json')

exports.command = 'test <problem>'
exports.desc = 'Test solution on LeetCode'
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
            .option('t', {
                alias:    'test',
                type:     'string',
                default: '',
                describe: 'Custom Test Case'
            })
            .positional('problem', {
                type:     'string',
                default:  '',
                describe: 'Question Title',
            })
            .example(chalk.yellow('leetcode test two-sum -l cpp -f test.cpp -t "[1,2,3,4] \n 7"'), 'Test Custom File')
}
exports.handler = async (args) => {
    const spinner = ora('Testing Question').start()
    try {
        titleSlug = args.problem
        file = args.f || 'sol.cpp'
        lang = args.l || 'cpp'

        const problem = await api.getProblem(titleSlug)

        problem.sampleTestCase = args.t || problem.sampleTestCase

        fs.readFile(process.env.HOME + '/Desktop/codes' + titleSlug + '/' + file, "utf-8", async function(err, data) {
            if(err)throw Error(err)
            api.test(problem, data, lang, function(response){
                spinner.stop()
                console.log(response)
            })
        });
    } catch (err) {
        spinner.stop()
        console.error(chalk.redBright.bold('Ran into some error! Try Again.'))
    }
}