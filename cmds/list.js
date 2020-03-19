const ora = require('ora')
const api = require('../utils/api')
const chalk = require('chalk')
var Table = require('cli-table3');

function difficultyLevelToWords(level){
    difficulty = null
    switch(level){
        case 1:
            difficulty = chalk.green('Easy')
            break
        case 2:
            difficulty = chalk.yellow('Medium')
            break
        case 3:
            difficulty = chalk.red('Hard')
            break
    }

    return difficulty
}

function addProblemDetail(table, problem){
    table.push([problem.stat.question_id, problem.stat.question__title_slug, difficultyLevelToWords(problem.difficulty.level)])
}

exports.command = 'list [category]'
exports.aliases = ['ls']
exports.desc = 'List LeetCode Problems Category wise'
exports.builder = function(yargs) {
    return yargs
    //   .option('t', {
    //     alias:    'tag',
    //     type:     'string',
    //     default:  false,
    //     describe: 'Filter Question by Tags'
    //   })
      .positional('category', {
        type:     'string',
        default:  'algorithms',
        describe: 'Filter Questions by Categogry',
        possible: ['algorithms', 'shell', 'database', 'concurrency']
      })
      .example(chalk.yellow('leetcode list shell'), 'List questions that belong to "shell" category')
  }
exports.handler = async (args) => {
    const spinner = ora('Loading Questions').start()
    try {
        const problems = await api.getProblems(args.category || 'algorithms')
        spinner.stop()

        var table = new Table();

        problems.forEach(problem => {
            addProblemDetail(table, problem)        
        });

        console.log(table.toString())
    } catch (err) {
        spinner.stop()
        console.error(chalk.redBright.bold('Ran into some error! Try Again.'))
    }
}