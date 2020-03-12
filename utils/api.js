const config = require('./config.json')
const axios = require('axios')
const chrome = require('chrome-cookies-secure');
const puppeteer = require('puppeteer');

var api = new Object()

api.login = async (username, password) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(config.urls.login);

    await page.waitFor(5000);

    await page.focus('#id_login')
    await page.keyboard.type(username)

    await page.focus('#id_password')
    await page.keyboard.type(password)
    
    await page.click('#signin_btn')
    await page.waitForNavigation()

    cookies = await page.cookies()

    await browser.close();

    return cookies
}

api.getProblems = async () => {
    const result = await axios({
        method: 'get',
        url: config.urls.problems.replace('$value', 'algorithms')
    })

    problems = result.data.stat_status_pairs

    return problems
}

api.getProblem = async (titleSlug) => {
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
}

api.test = async (problem, code, callback) => {
    
    chrome.getCookies(config.urls.base, async (err, cookies) => {
        response = await axios({
            method: 'post',
            url: config.urls.test.replace('$value', problem.titleSlug),
            headers: {                
                cookie: '__cfduid=d5e8d73e8ce852909460fb62b159385b91565080935; _ga=GA1.2.632816059.1565081018; __stripe_mid=4dac6ebb-79e3-4244-a92d-f656edf169c2; _gid=GA1.2.512198855.1583808600; __atuvc=6%7C7%2C5%7C8%2C9%7C9%2C1%7C10%2C1%7C11; csrftoken=e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjEzNzY2MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiY2ViZTE0MGE1NTVlODU5ZjA2MzFlOGI1N2M2YzQyYjAxNmFhYjg3MCIsImlkIjoyMTM3NjYzLCJlbWFpbCI6InNhaGlsLm1jYTE4LmR1QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25pc2hhbDMzIiwidXNlcl9zbHVnIjoic25pc2hhbDMzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL3NuaXNoYWwzMy9hdmF0YXJfMTU2NzY1Mzc2MS5wbmciLCJ0aW1lc3RhbXAiOiIyMDIwLTAzLTExIDA2OjA3OjIwLjM3ODg1NSswMDowMCIsIklQIjoiMTA2LjIwNC40OC45MCIsIklERU5USVRZIjoiOGE1NGY1OTY0MGUxNjA1ZjNlNDc4MzJjNDcwYmY2YjAiLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.GUgrmWCiu_6amGkyqbngVpJj76GENBi4A8zVTWrlaV0; c_a_u=c25pc2hhbDMz:1jCHkS:U7F_e5tcDhuQmWKox-lqtyfSwJg',
                'x-csrftoken': 'e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm',
                origin: config.urls.base,
                referer: config.urls.test.replace('$value', problem.titleSlug)
            },
            data: {
                data_input: problem.sampleTestCase,
                judgeType: problem.judgeType,
                lang: "cpp",
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

            if(result.data.state == 'SUCCESS'){
                console.log(result.data)
                clearInterval(verify)
                callback()
            }

        }, 3000)
    })
}

api.submit = async (problem, code, callback) => {

    chrome.getCookies(config.urls.base, async (err, cookies) => {
        response = await axios({
            method: 'post',
            url: config.urls.submit.replace('$value', problem.titleSlug),
            headers: {
                cookie: '__cfduid=d5e8d73e8ce852909460fb62b159385b91565080935; _ga=GA1.2.632816059.1565081018; __stripe_mid=4dac6ebb-79e3-4244-a92d-f656edf169c2; _gid=GA1.2.512198855.1583808600; __atuvc=6%7C7%2C5%7C8%2C9%7C9%2C1%7C10%2C1%7C11; csrftoken=e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjEzNzY2MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiY2ViZTE0MGE1NTVlODU5ZjA2MzFlOGI1N2M2YzQyYjAxNmFhYjg3MCIsImlkIjoyMTM3NjYzLCJlbWFpbCI6InNhaGlsLm1jYTE4LmR1QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25pc2hhbDMzIiwidXNlcl9zbHVnIjoic25pc2hhbDMzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL3NuaXNoYWwzMy9hdmF0YXJfMTU2NzY1Mzc2MS5wbmciLCJ0aW1lc3RhbXAiOiIyMDIwLTAzLTExIDA2OjA3OjIwLjM3ODg1NSswMDowMCIsIklQIjoiMTA2LjIwNC40OC45MCIsIklERU5USVRZIjoiOGE1NGY1OTY0MGUxNjA1ZjNlNDc4MzJjNDcwYmY2YjAiLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.GUgrmWCiu_6amGkyqbngVpJj76GENBi4A8zVTWrlaV0; c_a_u=c25pc2hhbDMz:1jBwm6:f3WPUXxqRInOsI86meywCOY19mQ',
                'x-csrftoken': 'e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm',
                origin: config.urls.base,
                referer: config.urls.submissionRefer.replace('$value', problem.titleSlug)
            },
            data: {
                lang: "cpp",
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
                    cookie: '__cfduid=d5e8d73e8ce852909460fb62b159385b91565080935; _ga=GA1.2.632816059.1565081018; __stripe_mid=4dac6ebb-79e3-4244-a92d-f656edf169c2; _gid=GA1.2.512198855.1583808600; __atuvc=6%7C7%2C5%7C8%2C9%7C9%2C1%7C10%2C1%7C11; csrftoken=e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjEzNzY2MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiY2ViZTE0MGE1NTVlODU5ZjA2MzFlOGI1N2M2YzQyYjAxNmFhYjg3MCIsImlkIjoyMTM3NjYzLCJlbWFpbCI6InNhaGlsLm1jYTE4LmR1QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25pc2hhbDMzIiwidXNlcl9zbHVnIjoic25pc2hhbDMzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL3NuaXNoYWwzMy9hdmF0YXJfMTU2NzY1Mzc2MS5wbmciLCJ0aW1lc3RhbXAiOiIyMDIwLTAzLTExIDA2OjA3OjIwLjM3ODg1NSswMDowMCIsIklQIjoiMTA2LjIwNC40OC45MCIsIklERU5USVRZIjoiOGE1NGY1OTY0MGUxNjA1ZjNlNDc4MzJjNDcwYmY2YjAiLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.GUgrmWCiu_6amGkyqbngVpJj76GENBi4A8zVTWrlaV0; c_a_u=c25pc2hhbDMz:1jBwm6:f3WPUXxqRInOsI86meywCOY19mQ',
                    'x-csrftoken': 'e8nYqAaBscuK3EPKPFC8aHl9DsCTvPTvfGcqq10LEYkdSg5U57cSU6lWxKICjDvm',
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
    });
}

module.exports = api