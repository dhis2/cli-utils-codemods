const log = require('@dhis2/cli-helpers-engine').reporter
const { availableCodemods: availableCodemodsLocal } = require('../utils/codemods/availableCodemods')
const { findAvailableCodemodsInNodeModules } = require('../utils/codemods/findAvailableCodemodsInNodeModules')
const { mergeCodemods } = require('../utils/codemods/mergeCodemods')

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
    .option('cwd', {
        describe:
            "The directory containing the project's node_modules directory",
        type: 'string',
        default: process.cwd(),
    })

module.exports.handler = argv => {
    const { package, name, cwd } = argv
    const availableCodemodsInNodeModules = findAvailableCodemodsInNodeModules(cwd)
    const availableCodemods = mergeCodemods(
        availableCodemodsLocal.filter(([_, group]) => group.length),
        availableCodemodsInNodeModules
    )

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
