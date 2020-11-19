const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')
const path = require('path')

const { availableCodemods } = require('../utils/codemods/availableCodemods')
const { exec } = require('./apply/exec')
const { getCodemodByPackageAndName } = require('../utils/codemods/getPathByPackageAndName')

module.exports.command = 'apply <files..>'
module.exports.alias = 'a'
module.exports.desc = 'Applys a codemod on a given file/directory'

module.exports.builder = yargs =>
    yargs
        .positional('files', {
            describe: 'Files or path the codemod should be applied to',
            type: 'array',
        })
        .option('package', {
            describe: 'The name of the package that contains the codemod',
            type: 'string',
        })
        .option('name', {
            describe: 'Name of the codemod',
            type: 'string',
        })
        .implies('package', 'name')
        .option('codemodPath', {
            describe: 'Direct path to codemod file',
            type: 'string',
            default: '',
        })
        .conflicts('codemodPath', 'package')
        .conflicts('codemodPath', 'name')
        .option('forward-args', {
            describe: 'Args that should be forwarded to the codemod',
            type: 'array',
            default: [],
        })

module.exports.handler = argv => {
    const {
        name,
        files,
        package,
        forwardArgs,
        codemodPath,
    } = argv

    /*
     * When testing, we can use a custom path to the codemods
     * When not testing, we try to get the path from the config
     */
    let transformFile = codemodPath
        ? codemodPath
        : (() => {
            const [error, codemod] = getCodemodByPackageAndName(
                package,
                name,
                availableCodemods,
            )

            if (error) {
                log.error(error)
                process.exit(1)
            }

            return codemod.path
        })()

    const forward = (forwardArgs || [])
        .map(forwardArg => forwardArg.split('='))
        .map(([key, value]) => `--${key} ${value}`)

    const result = exec({
        transformFile,
        positionalArguments: [...files, ...forward],
    })

    return result.then(({ error }) => process.exit(error))
}
