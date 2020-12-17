const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')
const path = require('path')

const isDotFolder = name => name[0] === '.'

const isNotDotFolder = name => !isDotFolder(name)

const isDotJSFile = name => new RegExp('[.]js$').test(name)

const isFolder = path => {
    if (!fs.existsSync(path)) return false
    return fs.lstatSync(path).isDirectory()
}

const hasCodemods = codemodsPath =>
    !!fs.readdirSync(codemodsPath).filter(curFile => {
        const curPath = path.join(codemodsPath, curFile)

        if (isFolder(curPath)) return false
        if (!curFile.match(/\.(j|t)sx?$/)) return false

        return true
    }).length

/**
 * Tries to find the following dirs that contain .js files:
 *   - ${NODE_MODULES}/{{folder}}/codemods/
 *   - ${NODE_MODULES}/{{namespace}}/{{folder}}/codemods/
 *
 * @param {Object} paths
 * @returns {String[]}
 */
const findCodemodsFolders = paths => {
    return fs
        .readdirSync(paths.NODE_MODULES)
        .filter(name => {
            const curPath = path.join(paths.NODE_MODULES, name)

            if (isDotFolder(name)) return false
            if (!isFolder(curPath)) return false

            return true
        })
        .reduce((acc, cur) => {
            const curPath = path.join(paths.NODE_MODULES, cur)

            // Node module is not namespace and contains codemods
            if (
                isFolder(path.join(curPath, 'codemods')) &&
                hasCodemods(path.join(curPath, 'codemods'))
            ) {
                return [...acc, cur]
            }

            // Node module is a namespace containing node modules that contain codemods
            const curPathFolders = fs
                .readdirSync(curPath)
                .filter(
                    name =>
                        isNotDotFolder(name) &&
                        isFolder(path.join(curPath, name, 'codemods')) &&
                        hasCodemods(path.join(curPath, name, 'codemods'))
                )
                .map(name => `${cur}/${name}`)

            return [...acc, ...curPathFolders]
        }, [])
}

const extractCodemods = (paths, moduleName) => {
    const { NODE_MODULES } = paths
    const codemodsPath = path.join(NODE_MODULES, moduleName, 'codemods')

    const codemodFiles = fs
        .readdirSync(codemodsPath)
        .filter(isNotDotFolder)
        .filter(isDotJSFile)

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
    const { NODE_MODULES } = paths

    if (!fs.pathExistsSync(NODE_MODULES)) {
        log.debug(`Cound not find node_modules directory`)
        return []
    }

    return findCodemodsFolders(paths).map(moduleName => [
        moduleName,
        extractCodemods(paths, moduleName),
    ])
}
