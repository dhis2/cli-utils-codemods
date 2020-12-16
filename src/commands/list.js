const log = require('@dhis2/cli-helpers-engine').reporter
const {
    findAvailableCodemodsInNodeModules,
} = require('../utils/codemods/findAvailableCodemodsInNodeModules.js')
const { makePaths } = require('../utils/makePaths.js')

module.exports.command = 'list [packages..]'
module.exports.alias = 'l'
module.exports.desc = ''

module.exports.builder = yargs =>
    yargs
        .positional('packages', {
            describe: 'Only show codemods of the this package',
            type: 'array',
            default: [],
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
    const { packages, name, cwd } = argv
    const paths = makePaths(cwd)
    const availableCodemods = findAvailableCodemodsInNodeModules(paths)

    const filteredByPackage =
        packages.length === 0
            ? availableCodemods
            : availableCodemods.filter(([packageName]) =>
                  packages.includes(packageName)
              )

    const filteredByName =
        name === ''
            ? filteredByPackage
            : filteredByPackage
                  .map(([packageName, codemodsGroup]) => [
                      packageName,
                      codemodsGroup.filter(codemod =>
                          codemod.name.includes(name)
                      ),
                  ])
                  // eslint-disable-next-line no-unused-vars
                  .filter(([_, codemodsGroup]) => codemodsGroup.length)

    filteredByName.forEach(([groupName, group], index) => {
        if (index > 0) log.print('')
        log.print(groupName)
        group.forEach(codemod => log.print(`* ${groupName}:${codemod.name}`))
    })
}
