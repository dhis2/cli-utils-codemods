const path = require('path')
const log = require('@dhis2/cli-helpers-engine').reporter
const {
    findAvailableCodemodsInNodeModules,
} = require('../utils/codemods/findAvailableCodemodsInNodeModules')
const {
    getCodemodByPackageAndName,
} = require('../utils/codemods/getCodemodByPackageAndName')
const { makePaths } = require('../utils/makePaths.js')
const { exec } = require('./apply/exec')

module.exports.command = 'apply <codemod> [files..]'
module.exports.alias = 'a'
module.exports.desc = 'Applys a codemod on a given file/directory'

module.exports.builder = yargs =>
    yargs
        .positional('codemod', {
            describe:
                'Colon-separated node package & codemod name. OR a direct path to codemod file',
            type: 'string',

            // Needs to be a string, see
            // https://github.com/yargs/yargs/issues/1393
            demandOption: 'true',
        })
        .positional('files', {
            describe: 'Files or path the codemod should be applied to',
            type: 'array',
            default: '**/*',
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
    const { files, forwardArgs, codemod, cwd } = argv
    const paths = makePaths(cwd)
    const availableCodemods = findAvailableCodemodsInNodeModules(paths)

    /*
     * When testing, we can use a custom path to the codemods
     * When not testing, we try to get the path from the config
     */
    const transformFile = !codemod.includes(':')
        ? codemod.match(/^\//)
            ? codemod
            : path.join(process.cwd(), codemod)
        : (() => {
              const [pkg, name] = codemod.split(':')
              const [error, codemodData] = getCodemodByPackageAndName(
                  pkg,
                  name,
                  availableCodemods
              )

              if (error) {
                  log.error(error)
                  process.exit(1)
              }

              return path.join(codemodData.path, codemodData.name)
          })()

    const forward = (forwardArgs || [])
        .map(forwardArg => forwardArg.split('='))
        .reduce((all, [key, value]) => ({ ...all, [key]: value }), {})

    const result = exec({ transformFile, files, forward })

    return result.then(({ error }) => process.exit(error))
}
