const log = require('@dhis2/cli-helpers-engine').reporter
const path = require('path')

const { exec } = require('./apply/exec')
const {
    findAvailableCodemodsInNodeModules,
} = require('../utils/codemods/findAvailableCodemodsInNodeModules')
const {
    getCodemodByPackageAndName,
} = require('../utils/codemods/getCodemodByPackageAndName')
const { makePaths } = require('../utils/makePaths.js')

module.exports.command = 'apply <files..>'
module.exports.alias = 'a'
module.exports.desc = 'Applys a codemod on a given file/directory'

module.exports.builder = yargs =>
    yargs
        .positional('files', {
            describe: 'Files or path the codemod should be applied to',
            type: 'array',
        })

        .option('pkg', {
            describe: 'The name of the package that contains the codemod',
            type: 'string',
            default: '',
        })
        .option('name', {
            describe: 'Name of the codemod',
            type: 'string',
            default: '',
        })
        .implies('package', 'name')

        .option('codemodPath', {
            describe: 'Direct path to codemod file',
            type: 'string',
            default: '',
        })

        .option('forward-args', {
            describe: 'Args that should be forwarded to the codemod',
            type: 'array',
            default: [],
        })
        .option('cwd', {
            describe:
                "The directory containing the project's node_modules directory",
            type: 'string',
            default: process.cwd(),
        })

module.exports.handler = argv => {
    const { name, files, pkg, forwardArgs, codemodPath, cwd } = argv
    const paths = makePaths(cwd)
    const availableCodemods = findAvailableCodemodsInNodeModules(paths)

    /*
     * When testing, we can use a custom path to the codemods
     * When not testing, we try to get the path from the config
     */
    const transformFile = codemodPath
        ? codemodPath.match(/^\//)
            ? codemodPath
            : path.join(process.cwd(), codemodPath)
        : (() => {
              const [error, codemod] = getCodemodByPackageAndName(
                  pkg,
                  name,
                  availableCodemods
              )

              if (error) {
                  log.error(error)
                  process.exit(1)
              }

              return path.join(codemod.path, codemod.name)
          })()

    const forward = (forwardArgs || [])
        .map(forwardArg => forwardArg.split('='))
        .reduce((all, [key, value]) => ({ ...all, [key]: value }), {})

    const result = exec({ transformFile, files, forward })

    return result.then(({ error }) => process.exit(error))
}
