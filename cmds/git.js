const ora = require("ora")
const chalk = require("chalk")
const config = require('../utils/config.json')
const simpleGitPromise = require('simple-git/promise')(process.env.HOME + '/Desktop/codes/')

exports.command = 'git'
exports.desc = 'Push local Solutions to Github'
exports.builder = function(yargs) {
    return yargs
            .option('m', {
                alias: 'message',
                type:     'string',
                default: 'New Commit',
                describe: 'Message with new commit'
            })
            .option('i', {
                type:     'boolean',
                default: 'false',
                describe: 'Origin to Github repo'
            })
            .example(chalk.yellow('leetcode git -m "Two-Sum"'), 'Push new commit with message')
}
exports.handler = async (args) => {
    const spinner = ora('Updating Git').start()
    try {
        if(args.i === true){
            //add callbacks
            simpleGitPromise.init()
            simpleGitPromise.addRemote('origin', args.i)
        }

        simpleGitPromise.pull('origin', 'master')

        simpleGitPromise.add('.')
            .then(
            (addSuccess) => {
                // console.log(addSuccess);
            }, (failedAdd) => {
                throw Error(failedAdd)
            });

        commitMessage = args.m || 'New Commit'
        simpleGitPromise.commit(commitMessage)
        .then(
            (successCommit) => {
                // console.log(successCommit);
            }, (failed) => {
                throw Error(failed)
        });
        
        simpleGitPromise.push('origin','master')
            .then((success) => {
            console.log('Repo successfully pushed');
            },(failed)=> {
                throw Error(failed)
        });

        spinner.stop()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}