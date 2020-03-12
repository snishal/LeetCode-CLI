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

    fs.writeFile('utils/cookies.json', JSON.stringify(reqCookies), function(e){
        if(e) throw e
        console.log('Cookies Updated')
    })
}

module.exports = async (args) => {
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
    
                const spinner = ora('Logging In').start()
                
                cookies = await api.login(result.username, result.password)

                setCookies(cookies)

                spinner.stop()
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}