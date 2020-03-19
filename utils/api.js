const config = require('./config.json')
const cookies = require(process.env.HOME + '/.leetcode/cookies.json')
const axios = require('axios')
const puppeteer = require('puppeteer');

var api = new Object()

api.login = async (username, password) => {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(config.urls.login);

        await page.waitForSelector('#signin_btn');

        await page.focus('#id_login')
        await page.keyboard.type(username)

        await page.focus('#id_password')
        await page.keyboard.type(password)
        
        await page.click('#signin_btn')
        await page.waitForNavigation()

        browserCookies = await page.cookies()

        await browser.close();

        return browserCookies
    }catch(e){
        console.error(e)
    }
}

api.getProblems = async (category) => {
    try{
        const result = await axios({
            method: 'get',
            url: config.urls.problems.replace('$value', category)
        })

        problems = result.data.stat_status_pairs

        return problems
    }catch(e){
        throw Error(e)
    }
}

api.getProblem = async (titleSlug) => {
    try{
        const result = await axios({
            method: 'post',
            url: config.urls.graphql,
            data: {
                operationName: "questionData",
                query: `query questionData($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                    questionId
                    questionFrontendId
                    boundTopicId
                    title
                    titleSlug
                    content
                    translatedTitle
                    translatedContent
                    isPaidOnly
                    difficulty
                    likes
                    dislikes
                    isLiked
                    similarQuestions
                    contributors {
                        username
                        profileUrl
                        avatarUrl
                        __typename
                    }
                    langToValidPlayground
                    topicTags {
                        name
                        slug
                        translatedName
                        __typename
                    }
                    companyTagStats
                    codeSnippets {
                        lang
                        langSlug
                        code
                        __typename
                    }
                    stats
                    hints
                    solution {
                        id
                        canSeeDetail
                        paidOnly
                        __typename
                    }
                    status
                    sampleTestCase
                    metaData
                    judgerAvailable
                    judgeType
                    mysqlSchemas
                    enableRunCode
                    enableTestMode
                    enableDebugger
                    envInfo
                    libraryUrl
                    adminUrl
                    __typename
                    }
                }`,
                variables: {
                    titleSlug: titleSlug
                }
            } 
        })

        return result.data.data.question
    }catch(e){
        console.log(e)
    }
}

api.test = async (problem, code, lang, callback) => {
    try{
        response = await axios({
            method: 'post',
            url: config.urls.test.replace('$value', problem.titleSlug),
            headers: {                
                cookie: 'csrftoken='+cookies.csrftoken+'; LEETCODE_SESSION='+cookies.session,
                'x-csrftoken': cookies.csrftoken,
                origin: config.urls.base,
                referer: config.urls.test.replace('$value', problem.titleSlug)
            },
            data: {
                data_input: problem.sampleTestCase,
                judgeType: problem.judgeType,
                lang: lang,
                question_id: problem.questionId,
                typed_code: code
            }
        })

        interpret_id = response.data.interpret_id

        verify = setInterval(async () => {
            result = await axios({
                method: 'get',
                url: config.urls.verify.replace('$value', interpret_id)
            })

            if(result.data.state == 'SUCCESS' || result.data.state == 'FAILURE'){
                console.log(result.data)
                clearInterval(verify)
                callback()
            }

        }, 3000)
    }catch(e){
        console.log(e)
    }
}

api.submit = async (problem, code, lang, callback) => {
    try{
        response = await axios({
            method: 'post',
            url: config.urls.submit.replace('$value', problem.titleSlug),
            headers: {
                cookie: 'csrftoken='+cookies.csrftoken+'; LEETCODE_SESSION='+cookies.session,
                'x-csrftoken': cookies.csrftoken,
                origin: config.urls.base,
                referer: config.urls.submissionRefer.replace('$value', problem.titleSlug)
            },
            data: {
                lang: lang,
                question_id: problem.questionId,
                typed_code: code
            }
        })

        submission_id = response.data.submission_id

        verify = setInterval(async () => {
            result = await axios({
                method: 'get',
                url: config.urls.verify.replace('$value', submission_id),
                headers: {
                    cookie: 'csrftoken='+cookies.csrftoken+'; LEETCODE_SESSION='+cookies.session,
                    'x-csrftoken': cookies.csrftoken,
                    origin: config.urls.base,
                    referer: config.urls.submissionRefer.replace('$value', problem.titleSlug)
                }
            })

            if(result.data.state == 'SUCCESS'){
                console.log(result.data)
                clearInterval(verify)
                callback()
            }

        }, 1000)
    }catch(e){
        console.log(e)
    }
}

module.exports = api