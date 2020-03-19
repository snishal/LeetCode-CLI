const ora = require('ora')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')
const api = require('../utils/api')
const config = require('../utils/config.json')

function viewProblem(problem){
    console.log('[' + problem.questionId + '] ' + chalk.bold(problem.title))

    tags = ''
    problem.topicTags.forEach(element => {
        tags += element.name + ' '
    });
    console.log(chalk.bold('Tags') + ' : ' + chalk.bgGray(tags))

    languages = ''
    problem.codeSnippets.forEach(element => {
        languages += element.lang + ' '
    });
    console.log(chalk.bold('Languages') + ' : ' +  chalk.bgRed(languages))

    console.log(chalk.bold('Problem Description : '))
    console.log(cheerio.load(problem.content).text())
}

function getInfo(problem, lang){
    obj = null
    problem.codeSnippets.forEach(element => {
        if(element.lang == lang){
            obj = element
        }
    })

    return obj
}

function createFile(title, file, content){
    if(!fs.existsSync(config.dir)){
        fs.mkdirSync(config.dir, { recursive: true }, (err) => {
            if (err) throw Error(e)
        });
    }

    filePath = config.dir + title

    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath, { recursive: true }, (err) => {
            if (err) throw Error(e)
        });
    }

    fs.writeFile(filePath + '/' + file, content, function(e){
        if(e){
            throw Error(e)
        }else{
            console.log(chalk.bold('Code File Created'))
        }
    })
}

exports.command = 'try <problem>'
exports.desc = 'View Problem and Generate File'
exports.aliases = ['pick', 'view']
exports.builder = function(yargs) {
    return yargs
            .option('l', {
                alias:    'lang',
                type:     'string',
                default: 'C++',
                describe: 'Language to Code'
            })
            .option('f', {
                alias:    'file',
                type:     'string',
                default: 'sol.cpp',
                describe: 'Name of File'
            })
            .option('q', {
                alias:    'question',
                type:     'boolean',
                default: 'false',
                describe: 'Inclue Question Description in Code File'
            })
            .positional('problem', {
                type:     'string',
                default:  '',
                describe: 'Fetch Question by Title',
            })
            .example(chalk.yellow('leetcode list two-sum'), 'View Question detail')
            .example(chalk.yellow('leetcode list two-sum -l Python3 -f test.py -q'), 'Create file with Question Description')
}
exports.handler = async (args) => {
    titleSlug = args.problem || 'two-sum'
    
    const spinner = ora('Loading Question').start()
    try {
        const problem = await api.getProblem(titleSlug)

        spinner.stop()

        viewProblem(problem)

        lang = args.l || 'C++'
        file = args.f || 'sol.cpp'

        //refactor
        obj = getInfo(problem, lang)
        content = ''
        if(args.q){
            console.log('here')
            content += '/* \n' + cheerio.load(problem.content).text() + '*/ \n'
        }
        content += obj.code
        createFile(problem.titleSlug, file, content)

    } catch (err) {
        spinner.stop()
        console.error(chalk.redBright.bold('Ran into some error! Try Again.'))
    }
}