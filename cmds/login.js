const ora = require('ora')
const prompt = require('prompt')
const api = require('../utils/api')

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

                spinner.stop()
        });
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}