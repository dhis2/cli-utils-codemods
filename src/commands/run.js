const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')
const path = require('path')

const { exec } = require('./run/exec')

module.exports.command = 'run <package> <codemod> <files..>'
module.exports.alias = 'r'
module.exports.desc = `* Runs a jscodemod.
* Packages must be in the "node_modules" dir
* Codemods must be located in "codemods" folders

Example:
* run @dhis2/cli-utils-cypress name-of-a-codemod cypress/integration/**/*.js --forwardArgs key1=val1 key2=val2
-> Will run the "name-of-a-codemod.js"
-> Located in ./node_modules/@dhis2/cli-utils-cypress/codemods/name-of-a-codemod.js
-> Will apply codemod to all js files located in cypress/integration
-> Will forward { key1: 'val1', key2: 'val2' } to the codemod
`

module.exports.builder = yargs =>
    yargs
        .positional('package', {
            describe: 'The name of the package that contains the codemod',
            type: 'string',
        })
        .positional('codemod', {
            describe: 'Name of the codemod file',
            type: 'string',
        })
        .positional('files', {
            describe: 'Files or path the codemod should be applied to',
            type: 'string',
        })
        .option('package-folder', {
            describe: 'The package the folder can be found in',
            type: 'string',
            default: path.join(`${process.cwd()}`, 'node_modules')
        })
        .option('codemods-folder', {
            describe: 'The package the codemods can be found in',
            type: 'string',
            default: 'codemods',
        })
        .option('forward-args', {
            describe: 'Args that should be forwarded to the codemod',
            type: 'array',
            default: [],
        })

module.exports.handler = argv => {
    const {
        codemod,
        codemodsFolder,
        files,
        forwardArgs,
        package,
        packageFolder,
    } = argv

    const packagePath = path.join(packageFolder, package)
    if (!fs.pathExistsSync(packagePath)) {
        log.error(`The package "${package}" is not installed. Check your package.json if it's included.`)
        process.exit(1)
    }

    const codemodsPath = path.join(packagePath, codemodsFolder)
    if (!fs.pathExistsSync(codemodsPath)) {
        log.error(`The package "${package}" does not contain any codemods.`)
        process.exit(1)
    }

    const scriptPath = path.join(codemodsPath, `${codemod}.js`)
    if (!fs.pathExistsSync(scriptPath)) {
        log.error(`The package "${package}" does not have a codemod called "${codemod}"`)
    }

    log.info('Starting running the codemod\n')

    const forward = (forwardArgs || [])
        .map(forwardArg => forwardArg.split('='))
        .map(([key, value]) => `--${key} ${value}`)

    const positionalArguments = [
        //'-t', // tells codeshift to transform files
        //scriptPath, // path to the codemod
        ...files,
        ...forward,
    ]

    const result = exec({ transformFile: scriptPath, positionalArguments })
    return result.then(({ error }) => process.exit(error))
}
