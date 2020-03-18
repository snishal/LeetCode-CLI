const ora = require('ora')
const api = require('../utils/api')

function difficultyLevelToWords(level){
    difficulty = null
    switch(level){
        case 1:
            difficulty = 'Easy'
            break
        case 2:
            difficulty = 'Medium'
            break
        case 3:
            difficulty = 'Hard'
            break
    }

    return difficulty
}

function viewProblemDetail(problem){
    console.log('[' + problem.stat.question_id + ']' + '\t' + problem.stat.question__title + '\t' +  problem.stat.question__title_slug + '\t' + difficultyLevelToWords(problem.difficulty.level))
}

exports.command = 'list'
exports.desc = 'List LeetCode Problems'
exports.handler = async (args) => {
    const spinner = ora('Loading Questions').start()
    try {
        const problems = await api.getProblems()

        spinner.stop()

        problems.forEach(problem => {
            viewProblemDetail(problem)        
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}