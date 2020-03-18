const ora = require('ora')
const cheerio = require('cheerio')
const fs = require('fs')
const api = require('../utils/api')
const config = require('../utils/config.json')

function viewProblem(problem){
    console.log('[' + problem.questionId + '] ' + problem.title)

    tags = ''
    problem.topicTags.forEach(element => {
        tags += element.name + '\t'
    });
    console.log(tags)

    languages = ''
    problem.codeSnippets.forEach(element => {
        languages += element.lang + '\t'
    });
    console.log(languages)

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

function createFile(title, file, ext, content){
    if(!fs.existsSync(config.dir)){
        fs.mkdirSync(config.dir, { recursive: true }, (err) => {
            if (err) console.log(err);
        });
    }

    filePath = config.dir + title

    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath, { recursive: true }, (err) => {
            if (err) console.log(err);
        });
    }

    fs.writeFile(filePath + '/' + file+'.'+ext, content, function(e){
        if(e) throw e
        console.log('Code File Created')
    })
}

exports.command = 'try'
exports.desc = 'View Problem'
exports.handler = async (args) => {
    titleSlug = args._[1] || 'two-sum'
    
    const spinner = ora('Loading Question').start()
    try {
        const problem = await api.getProblem(titleSlug)

        spinner.stop()

        viewProblem(problem)

        lang = args.l || 'C++'
        file = args.f || '1'

        //refactor
        obj = getInfo(problem, lang)
        content = ''
        if(args.q){
            console.log('here')
            content += '/* \n' + cheerio.load(problem.content).text() + '*/ \n'
        }
        content += obj.code
        createFile(problem.titleSlug, file, obj.langSlug, content)

    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}