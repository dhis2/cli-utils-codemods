const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')
const path = require('path')
const { getDhis2NodeModulesDir } = require('./getDhis2NodeModulesDir')

const isNotDotFolder = value => value !== '.' && value !== '..'

const isDotJSFile = name => new RegExp('[.]js$').test(name)

const extractCodemods = (dhis2ModulesDir, moduleName) => {
    const codemodsPath = path.join(dhis2ModulesDir, moduleName, 'codemods')

    if (!fs.pathExistsSync(codemodsPath)) {
        log.debug(
            `Cound not find a codemods folder in node module '${moduleName}' directory`
        )

        return []
    }

    const codemodFiles = fs.readdirSync(codemodsPath)
        .filter(isNotDotFolder)
        .filter(isDotJSFile)

    if (!codemodFiles.length) {
        log.debug('no codemod files');
        return []
    }

    const codemodConfigs = codemodFiles.map(codemodName => {
        const foundCodemod = ({
            name: codemodName,
            path: codemodsPath,
        })

        return foundCodemod
    })

    return codemodConfigs
}

module.exports.findAvailableCodemodsInNodeModules = cwd => {
    const dhis2ModulesDir = getDhis2NodeModulesDir(cwd)

    if (!fs.pathExistsSync(dhis2ModulesDir)) {
        log.debug(`Cound not find node_modules directory`)
        return []
    }

    const codemods = fs.readdirSync(dhis2ModulesDir)
        .filter(isNotDotFolder)
        .map(moduleName => [
            moduleName,
            extractCodemods(dhis2ModulesDir, moduleName),
        ])
        .filter(([_, codemods]) => codemods.length)

    return codemods
}
