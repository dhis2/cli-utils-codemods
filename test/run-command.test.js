const assertDirEqual = require('assert-dir-equal')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

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
            'run',
            'codemods',
            //'d2-v31.1.0-change-imports',
            'rename-foo',
            PATH_RUN_ACTUAL,

            // use the parent folder of this package,
            // so it can be found
            '--packageFolder',
            path.join(__dirname, '..', '..'),

            // use custom testing codemods dir,
            // so we don't have to publish this
            '--codemodsFolder',
            'test/codemods',
        ])

        assertDirEqual(PATH_RUN_ACTUAL, PATH_RUN_EXPECTED)
    });
});
