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

const getPathOfDependency = dependency => {
    const packageJsonResolvePath = `${dependency}/package.json`

    try {
        const resolvedPath = require.resolve(
            packageJsonResolvePath,
            process.env.NODE_ENV === 'test'
                ? { paths: [process.env.RESOLVE_PATH] }
                : undefined
        )

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
        const depPath = getPathOfDependency(dependency)

        if (!depPath) {
            return acc
        }

        const codemodPath = path.join(depPath, 'codemods')

        if (!isFolder(codemodPath)) {
            return acc
        }

        if (!hasCodemods(codemodPath)) {
            return acc
        }

        return [...acc, dependency]
    }, [])
}

const extractCodemods = (paths, moduleName) => {
    const depPath = getPathOfDependency(moduleName)

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
