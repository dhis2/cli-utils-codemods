const assertDirEqual = require('assert-dir-equal')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

const FILES_PATH = path.join(__dirname, 'files-to-mod')
const PATH_ACTUAL = path.join(FILES_PATH, 'actual-files')

const apply = options => {
    const result = spawn.sync('./bin/d2-utils-codemods', [
        // command
        'apply',
        ...options,
    ])

    if (result.stderr.toString()) {
        console.log('STDOUT:')
        console.log(result.stdout.toString())
        console.log('STDERR:')
        console.log(result.stderr.toString())
    }

    return result
}

describe('Command: apply', () => {
    beforeEach(() => {
        // ensure that the "actual" directory is not there
        fs.removeSync(PATH_ACTUAL)
    })

    it('should accept a direct path to a codemod', () => {
        const codemods = path.join(__dirname, 'codemods')
        const sourceFiles = path.join(
            FILES_PATH,
            'apply-codemod-path-source-files'
        )
        const expectedFiles = path.join(
            FILES_PATH,
            'apply-codemod-path-expected-files'
        )

        // copy source files so the test can work on them
        fs.copySync(sourceFiles, PATH_ACTUAL)

        apply([
            // path to the codemod
            path.join(codemods, 'rename-foo.js'),

            // path with files to apply the codemod to
            PATH_ACTUAL,
        ])

        assertDirEqual(PATH_ACTUAL, expectedFiles)
    })

    it('should use a codemod from a node_modules directory', () => {
        const sourceFiles = path.join(
            FILES_PATH,
            'apply-node-modules-mods-source-files'
        )
        const expectedFiles = path.join(
            FILES_PATH,
            'apply-node-modules-mods-expected-files'
        )

        // copy source files so the test can work on them
        fs.copySync(sourceFiles, PATH_ACTUAL)

        apply([
            // codemod
            '@dhis2/module1:rename-foo.js',

            // files
            PATH_ACTUAL,

            ...['--cwd', __dirname],
            ...['--forward-args', 'name=baz'],
        ])

        assertDirEqual(PATH_ACTUAL, expectedFiles)
    })
})
