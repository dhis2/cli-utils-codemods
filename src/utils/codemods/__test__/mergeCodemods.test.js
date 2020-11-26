const { mergeCodemods } = require('../mergeCodemods.js')

describe('mergeCodemods', () => {
    const config1 = [
        [
            'module1',
            [
                {
                    name: 'm1 - name 1',
                    path: 'm1 - path 1',
                },
                {
                    name: 'm1 - name 2',
                    path: 'm1 - path 2',
                },
            ],
        ],
        [
            'module2',
            [
                {
                    name: 'm2 - name 1',
                    path: 'm2 - path 1',
                },
                {
                    name: 'm2 - name 2',
                    path: 'm2 - path 2',
                },
            ],
        ],
    ]

    const config2 = [
        [
            'module1',
            [
                {
                    name: 'm1 - name 2',
                    path: 'm1 - different path 2',
                },
            ],
        ],
        [
            'module2',
            [
                {
                    name: 'm2 - name 3',
                    path: 'm2 - path 3',
                },
            ],
        ],
        [
            'module3',
            [
                {
                    name: 'm3 - name 1',
                    path: 'm3 - path 1',
                },
                {
                    name: 'm3 - name 2',
                    path: 'm3 - path 2',
                },
            ],
        ],
    ]

    it('should merge the two configs', () => {
        const expected = [
            [
                'module1',
                [
                    {
                        name: 'm1 - name 1',
                        path: 'm1 - path 1',
                    },
                    {
                        name: 'm1 - name 2',
                        path: 'm1 - different path 2',
                    },
                ],
            ],
            [
                'module2',
                [
                    {
                        name: 'm2 - name 1',
                        path: 'm2 - path 1',
                    },
                    {
                        name: 'm2 - name 2',
                        path: 'm2 - path 2',
                    },
                    {
                        name: 'm2 - name 3',
                        path: 'm2 - path 3',
                    },
                ],
            ],
            [
                'module3',
                [
                    {
                        name: 'm3 - name 1',
                        path: 'm3 - path 1',
                    },
                    {
                        name: 'm3 - name 2',
                        path: 'm3 - path 2',
                    },
                ],
            ],
        ]

        const actual = mergeCodemods(config1, config2)
        expect(actual).toEqual(expected)
    });
});
