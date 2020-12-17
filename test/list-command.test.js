const path = require('path')
const spawn = require('cross-spawn')

const list = (options = []) => {
    const result = spawn.sync(
        path.join(__dirname, '..', 'bin', 'd2-utils-codemods'),
        ['list', ...options],
        { cwd: __dirname }
    )

    if (result.stderr.toString()) {
        console.log('STDOUT:')
        console.log(result.stdout.toString())
        console.log('STDERR:')
        console.log(result.stderr.toString())
    }

    return result
}

/*
 * This is to handle the output awkwardness without having to deal with it in
 * the test cases, as this could potentially change any time, depending on what
 * the command uses to print the lines
 */
const output = lines => {
    let newLines = lines

    newLines = lines.map(line => `${line} `)
    newLines = [...newLines, '']

    return newLines.join('\n')
}

describe('Command: list', () => {
    it('show all available codemods', () => {
        const result = list()

        expect(result.stdout.toString()).toBe(
            output([
                '@dhis2/module1',
                '* @dhis2/module1:foo.js',
                '* @dhis2/module1:rename-foo.js',
                '',
                '@dhis2/module2',
                '* @dhis2/module2:bar.js',
                '',
                '@dhis2/module3',
                '* @dhis2/module3:foobar.js',
            ])
        )
    })

    it('should show only the codemods of the supplied packages', () => {
        const result = list(['@dhis2/module1', '@dhis2/module2'])

        expect(result.stdout.toString()).toBe(
            output([
                '@dhis2/module1',
                '* @dhis2/module1:foo.js',
                '* @dhis2/module1:rename-foo.js',
                '',
                '@dhis2/module2',
                '* @dhis2/module2:bar.js',
            ])
        )
    })

    it('should show only the codemods with the name option in its name', () => {
        const result = list(['--name', 'bar'])

        expect(result.stdout.toString()).toBe(
            output([
                '@dhis2/module2',
                '* @dhis2/module2:bar.js',
                '',
                '@dhis2/module3',
                '* @dhis2/module3:foobar.js',
            ])
        )
    })

    it('should show only the codemods with the name option in its name of the supplied package', () => {
        const result = list(['@dhis2/module2', '--name', 'bar'])

        expect(result.stdout.toString()).toBe(
            // Do not use a single line array to mimic actual output lines
            // eslint-disable-next-line prettier/prettier
            output([
                '@dhis2/module2',
                '* @dhis2/module2:bar.js',
            ])
        )
    })
})
