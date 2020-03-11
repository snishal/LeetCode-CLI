const menus = {
    main: `
      Welcome to Leetcode CLI
    `,
  
    list: `
      list all questions
    `,
}

module.exports = (argv) => {
    const subCmd = argv._[0] === 'help'
        ? argv._[1]
        : argv._[0]

    console.log(menus[subCmd] || menus.main)
}  