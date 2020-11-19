const assertDirEqual = require('assert-dir-equal')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

const PATH_CODEMODS = path.join(__dirname, 'codemods')
const PATH_RUN_SOURCE = path.join(__dirname, 'run-command-source-files')
const PATH_RUN_EXPECTED = path.join(__dirname, 'run-command-expected-files')
const PATH_RUN_ACTUAL = path.join(__dirname, 'run-command-actual-files')

describe('Command: run', () => {
    beforeAll(() => {
        // ensure that the "actual" directory is not there
        fs.removeSync(PATH_RUN_ACTUAL)

        // copy source files so the test can work on them
        fs.copySync(PATH_RUN_SOURCE, PATH_RUN_ACTUAL)
    })

    it('should replace the pre 31.1.0 d2 package path with the updated one', () => {
        const result = spawn.sync('./bin/d2-utils-codemods', [
            // command
            'apply',

            // path with files to apply the codemod to
            PATH_RUN_ACTUAL,

            // path to the codemod
            '--codemodPath',
            path.join(PATH_CODEMODS, 'rename-foo.js')
        ])

        assertDirEqual(PATH_RUN_ACTUAL, PATH_RUN_EXPECTED)
    });
});
