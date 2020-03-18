const ora = require("ora")
const config = require('../utils/config.json')
const simpleGitPromise = require('simple-git/promise')(config.dir)

exports.command = 'git'
exports.desc = 'Push local Solutions to Github'
exports.handler = async (args) => {
    const spinner = ora('Updating Git').start()
    try {
        if(args.i){
            //add callbacks

            simpleGitPromise.init()
            simpleGitPromise.addRemote('origin', args.i)
        }

        simpleGitPromise.pull('origin', 'master')

        simpleGitPromise.add('.')
            .then(
            (addSuccess) => {
                console.log(addSuccess);
            }, (failedAdd) => {
                console.log('adding files failed');
            });

        commitMessage = args.m || 'New Commit'
        simpleGitPromise.commit(commitMessage)
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