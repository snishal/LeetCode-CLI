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
            console.error(e)
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
                    throw err
                }else{
                    const spinner = ora('Logging In').start()
                    try{
                        cookies = await api.login(result.username, result.password)
                        
                        setCookies(cookies)
                        
                        spinner.stop()
                    }catch(e){
                        spinner.stop()
                        console.error(e)
                    }
                }
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}