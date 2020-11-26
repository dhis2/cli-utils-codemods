const path = require('path')
const { findAvailableCodemodsInNodeModules } = require('../findAvailableCodemodsInNodeModules')
const { getDhis2NodeModulesDir } = require('../getDhis2NodeModulesDir')

jest.mock('../getDhis2NodeModulesDir', () => ({
    getDhis2NodeModulesDir: jest.fn(),
}))

describe('getDhis2NodeModulesDir', () => {
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

    beforeAll(() => {
        getDhis2NodeModulesDir.mockImplementation(() => {
            return path.join(__dirname, 'findAvailableCodemodsInNodeModules')
        })
    })

    it('should find all the codemods in the node_modules/@dhis2 dir', () => {
        const actual = findAvailableCodemodsInNodeModules(__dirname)
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
    });
});
