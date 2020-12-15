const path = require('path')
const {
    findAvailableCodemodsInNodeModules,
} = require('../findAvailableCodemodsInNodeModules')

describe('findAvailableCodemodsInNodeModules', () => {
    const paths = {
        DHIS2_NODE_MODULES: path.join(
            __dirname,
            'findAvailableCodemodsInNodeModules'
        ),
    }

    const fooPath = path.join(
        __dirname,
        'findAvailableCodemodsInNodeModules',
        'module1',
        'codemods'
    )

    const barPath = path.join(
        __dirname,
        'findAvailableCodemodsInNodeModules',
        'module2',
        'codemods'
    )

    it('should find all the codemods in the node_modules/@dhis2 dir', () => {
        const actual = findAvailableCodemodsInNodeModules(paths)
        const expected = [
            [
                'module1',
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
                'module2',
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
