const ora = require('ora')
const cheerio = require('cheerio')
const fs = require('fs')
const api = require('../utils/api')

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

function createFile(title, file, ext, codeSnippet){
    filePath = '/home/sahil/Desktop/leetcode/codes/' + title
    fs.mkdirSync(filePath, { recursive: true }, (err) => {
        if (err) console.log(err);
        console.log('Folder Created')
    });

    fs.writeFile(filePath + '/' + file+'.'+ext, codeSnippet, function(e){
        if(e) throw e
        console.log('Code File Created')
    })
}

module.exports = async (args) => {
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
        createFile(problem.titleSlug, file, obj.langSlug, obj.code)

    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}