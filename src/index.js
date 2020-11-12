const { namespace } = require('@dhis2/cli-helpers-engine')

module.exports = namespace('codemod', {
    desc: 'Helps running codemods',
    builder: yargs => yargs.commandDir('commands'),
})
