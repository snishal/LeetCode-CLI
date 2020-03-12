const ora = require("ora")
const config = require('../utils/config.json')
const simpleGitPromise = require('simple-git/promise')(config.dir)

module.exports = async (args) => {
    const spinner = ora('Updating Git').start()
    try {
        if(args.i){
            //git init and add remote origin
        }

        simpleGitPromise.add('.')
            .then(
            (addSuccess) => {
                console.log(addSuccess);
            }, (failedAdd) => {
                console.log('adding files failed');
            });

        simpleGitPromise.commit('Commit Message')
        .then(
            (successCommit) => {
                console.log(successCommit);
            }, (failed) => {
                console.log('failed commmit');
        });
        
        simpleGitPromise.push('origin','master')
            .then((success) => {
            console.log('repo successfully pushed');
            },(failed)=> {
            console.log('repo push failed');
        });

        spinner.stop()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}