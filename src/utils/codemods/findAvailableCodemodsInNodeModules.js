const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')
const path = require('path')

const isNotDotFolder = value => value !== '.' && value !== '..'

const isDotJSFile = name => new RegExp('[.]js$').test(name)

const extractCodemods = (paths, moduleName) => {
    const { DHIS2_NODE_MODULES } = paths
    const codemodsPath = path.join(DHIS2_NODE_MODULES, moduleName, 'codemods')

    if (!fs.pathExistsSync(codemodsPath)) {
        log.debug(
            `Cound not find a codemods folder in node module '${moduleName}' directory`
        )

        return []
    }

    const codemodFiles = fs
        .readdirSync(codemodsPath)
        .filter(isNotDotFolder)
        .filter(isDotJSFile)

    if (!codemodFiles.length) {
        log.debug('no codemod files')
        return []
    }

    const codemodConfigs = codemodFiles.map(codemodName => {
        const foundCodemod = {
            name: codemodName,
            path: codemodsPath,
        }

        return foundCodemod
    })

    return codemodConfigs
}

module.exports.findAvailableCodemodsInNodeModules = paths => {
    const { DHIS2_NODE_MODULES } = paths

    if (!fs.pathExistsSync(DHIS2_NODE_MODULES)) {
        log.debug(`Cound not find node_modules directory`)
        return []
    }

    const codemods = fs
        .readdirSync(DHIS2_NODE_MODULES)
        .filter(isNotDotFolder)
        .map(moduleName => [moduleName, extractCodemods(paths, moduleName)])
        // eslint-disable-next-line no-unused-vars
        .filter(([_, codemods]) => codemods.length)

    return codemods
}
