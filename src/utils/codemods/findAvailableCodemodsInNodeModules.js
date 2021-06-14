const path = require('path')
const log = require('@dhis2/cli-helpers-engine').reporter
const fs = require('fs-extra')

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
        if (!isDotJSFile(curFile)) return false

        return true
    }).length

const getPathOfDependency = (dependency, cwd) => {
    const packageJsonResolvePath = `${dependency}/package.json`

    try {
        const paths = [cwd]
        const resolvedPath = require.resolve(packageJsonResolvePath, { paths })
        return path.dirname(resolvedPath)
    } catch (e) {
        return ''
    }
}

/**
 * Tries to find the following dirs that contain .js files:
 *   - ${NODE_MODULES}/{{folder}}/codemods/
 *   - ${NODE_MODULES}/{{namespace}}/{{folder}}/codemods/
 *
 * @param {Object} paths
 * @returns {String[]}
 */
const findCodemodsFolders = paths => {
    if (!fs.existsSync(paths.PACKAGE_JSON)) {
        return []
    }

    let packageJson
    try {
        packageJson = require(paths.PACKAGE_JSON)
    } catch (e) {
        log.warn('Could not parse package.json')
        log.debug(`Path to package.json: ${paths.PACKAGE_JSON}`)
        return []
    }

    if (!packageJson.dependencies && !packageJson.devDependencies) {
        log.debug('No (dev/prod) dependencies found in package.json')
        log.debug(`Path to package.json: ${paths.PACKAGE_JSON}`)
        return []
    }

    const dependencies = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
    ]

    return dependencies.reduce((acc, dependency) => {
        const depPath = getPathOfDependency(dependency, paths.cwd)

        if (!depPath) {
            return acc
        }

        const codemodPath = path.join(depPath, 'codemods')

        if (!isFolder(codemodPath) || !hasCodemods(codemodPath)) {
            return acc
        }

        return [...acc, dependency]
    }, [])
}

const extractCodemods = (paths, moduleName) => {
    const depPath = getPathOfDependency(moduleName, paths.cwd)

    if (!depPath) {
        return []
    }

    const codemodsPath = path.join(depPath, 'codemods')

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

module.exports.findAvailableCodemodsInNodeModules = paths =>
    findCodemodsFolders(paths).map(moduleName => [
        moduleName,
        extractCodemods(paths, moduleName),
    ])
