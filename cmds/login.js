const ora = require('ora')
const prompt = require('prompt')
const fs = require('fs')
const api = require('../utils/api')

function setCookies(cookies){
    var reqCookies = {
        csrftoken: "",
        session: ""
    }

    cookies.forEach(cookie => {
        if(cookie.name == 'csrftoken'){
            reqCookies.csrftoken = cookie.value
        }
        if(cookie.name == 'LEETCODE_SESSION'){
            reqCookies.session = cookie.value
        }
    });

    fs.writeFile(process.env.HOME + '/.leetcode/cookies.json', JSON.stringify(reqCookies), function(e){
        if(e){
            throw Error(e)
        }else{
            console.log('Cookies Updated')
        }
    })
}

exports.command = 'login'
exports.desc = 'Login into LeetCode'
exports.handler = async (args) => {
    try {
        prompt.start();

        prompt.get([{
            name: 'username',
            required: true
            }, {
            name: 'password',
            hidden: true,
            conform: function (value) {
                return true;
            }
            }], async function (err, result) {
                
                if(err){
                    throw Error(err)
                }else{
                    const spinner = ora('Logging In').start()
                    try{
                        cookies = await api.login(result.username, result.password)
                        
                        spinner.stop()

                        setCookies(cookies)
                    }catch(e){
                        throw Error(e)
                    }
                }
        });
    } catch (err) {
        spinner.stop()
        console.error(chalk.redBright.bold('Ran into some error! Try Again.'))
    }
}