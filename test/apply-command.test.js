const assertDirEqual = require('assert-dir-equal')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

const FILES_PATH = path.join(__dirname, 'files-to-mod')
const PATH_ACTUAL = path.join(FILES_PATH, 'actual-files')

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

        const result = spawn.sync('./bin/d2-utils-codemods', [
            // command
            'apply',

            // path with files to apply the codemod to
            PATH_ACTUAL,

            // path to the codemod
            '--codemodPath',
            path.join(codemods, 'rename-foo.js'),
        ])

        if (result.stderr.toString()) {
            console.log(result.stderr.toString())
        }

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

        const args = [
            // command
            'apply',

            // path with files to apply the codemod to
            PATH_ACTUAL,

            '--cwd',
            __dirname,
            '--pkg',
            'module1',
            '--name',
            'rename-foo.js',
            '--forward-args',
            'name=baz',
        ]

        const result = spawn.sync('./bin/d2-utils-codemods', args)

        if (result.stderr.toString()) {
            console.log(result.stderr.toString())
        }

        assertDirEqual(PATH_ACTUAL, expectedFiles)
    })
})
