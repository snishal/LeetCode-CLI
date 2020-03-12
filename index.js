module.exports = () => {
    const argv = require('yargs').argv
    
    let cmd = argv._[0] || 'help'

    if (argv.version || argv.v) {
        cmd = 'version'
    }

    if (argv.help || argv.h) {
        cmd = 'help'
    }

    switch (cmd) {
        case 'login':
            require('./cmds/login')(argv)
            break
            
        case 'list':
            require('./cmds/list')(argv)
            break

        case 'try':
            require('./cmds/try')(argv)
            break

        case 'test':
            require('./cmds/test')(argv)
            break

        case 'submit':
            require('./cmds/submit')(argv)
            break

        case 'version':
            require('./cmds/version')(argv)
            break

        case 'git':
            require('./cmds/git')(argv)
            break
            
        case 'help':
            require('./cmds/help')(argv)
            break

        default:
            console.error(`"${cmd}" is not a valid command!`)
            break
    }
}