const path = require('path')
const spawn = require('cross-spawn')

describe('Command: list', () => {
    it('should replace the pre 31.1.0 d2 package path with the updated one', () => {
        const result = spawn.sync(
            path.join(__dirname, '..', 'bin', 'd2-utils-codemods'),
            ['list'],
            { cwd: __dirname }
        )

        console.log(result.stdout.toString())

        if (result.stderr.toString()) {
            console.log(result.stderr.toString())
        }

        expect(result.stdout.toString()).toBe(
            [
                'module1 ',
                '* module1:foo.js ',
                '* module1:rename-foo.js ',
                ' ',
                'module2 ',
                '* module2:bar.js ',
                '',
            ].join('\n')
        )
    })
})
