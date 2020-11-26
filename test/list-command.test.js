const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

describe('Command: list', () => {
    it('should replace the pre 31.1.0 d2 package path with the updated one', () => {
        const result = spawn.sync(
            path.join(__dirname, '..', 'bin', 'd2-utils-codemods'),
            ['list'],
            { cwd: __dirname }
        )
    });
});
