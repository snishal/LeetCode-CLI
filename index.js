const fs = require('fs')
if(!fs.existsSync(process.env.HOME + '/.leetcode')){
    fs.mkdirSync(process.env.HOME + '/.leetcode', { recursive: true }, (err) => {
        if (err) throw Error(e)
    });
    var cookies = {
        "session": "",
        "csrftoken": ""
    };
    fs.writeFileSync(process.env.HOME + '/.leetcode/cookies.json', JSON.stringify(cookies), function(e){
        if(e){
            throw Error(e)
        }else{
            // console.log('Cookies Created')
        }
    })
}
module.exports = () => {
    require('yargs')
        .commandDir('cmds')
        .demandCommand()
        .help()
        .argv
}