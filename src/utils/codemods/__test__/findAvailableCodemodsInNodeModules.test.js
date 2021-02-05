const path = require('path')
const {
    findAvailableCodemodsInNodeModules,
} = require('../findAvailableCodemodsInNodeModules')

describe('findAvailableCodemodsInNodeModules', () => {
    const paths = {
        cwd: path.join(__dirname, 'findAvailableCodemodsInNodeModules'),
        PACKAGE_JSON: path.join(
            __dirname,
            'findAvailableCodemodsInNodeModules',
            'package.json'
        ),
    }

    const fooPath = path.join(
        __dirname,
        'findAvailableCodemodsInNodeModules',
        'node_modules',
        '@dhis2',
        'module1',
        'codemods'
    )

    const barPath = path.join(
        __dirname,
        'findAvailableCodemodsInNodeModules',
        'node_modules',
        '@dhis3',
        'module2',
        'codemods'
    )

    it('should find all the codemods in the node_modules/@dhis2 dir', () => {
        const actual = findAvailableCodemodsInNodeModules(paths)
        const expected = [
            [
                '@dhis2/module1',
                [
                    {
                        name: 'foo.js',
                        path: fooPath,
                    },
                    {
                        name: 'foobar.js',
                        path: fooPath,
                    },
                ],
            ],
            [
                '@dhis3/module2',
                [
                    {
                        name: 'bar.js',
                        path: barPath,
                    },
                    {
                        name: 'barbaz.js',
                        path: barPath,
                    },
                ],
            ],
        ]

        expect(actual).toEqual(expected)
    })
})
