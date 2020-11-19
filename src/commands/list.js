const log = require('@dhis2/cli-helpers-engine').reporter
const { availableCodemods } = require('../utils/codemods/availableCodemods')

module.exports.command = 'list'
module.exports.alias = 'l'
module.exports.desc = ''

module.exports.builder = yargs => yargs
    .option('package', {
        describe: 'Only show codemods of the this package',
        type: 'string',
        default: 'all'
    })
    .option('name', {
        describe: 'Filters by a sequence in the names',
        type: 'string',
        default: '',
    })

module.exports.handler = argv => {
    const { package, name, group } = argv

    const filteredByPackage = package === 'all'
        ? availableCodemods
        : availableCodemods.filter(([packageName]) => package === packageName)

    const filteredByName = name === ''
        ? filteredByPackage
        : filteredByPackage
              .map(([packageName, codemodsGroup]) => [
                  packageName,
                  codemodsGroup.filter(codemod => codemod.name.includes(name))
              ])
              .filter(([_, codemodsGroup]) => codemodsGroup.length)

    filteredByName.forEach(([groupName, group], index) => {
        if (index > 0) log.print('')
        log.print(groupName)
        group.forEach(codemod => log.print(`  ${codemod.name}`))
    })
}
