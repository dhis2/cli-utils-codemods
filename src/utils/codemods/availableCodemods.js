const { resolveCodemod } = require('./resolveCodemod')

module.exports.availableCodemods = [
    [
        '@dhis2/d2-ui',
        [
            {
                name: '31.1.0-change-imports.js',
                path: resolveCodemod('d2-ui'),
            },
        ],
    ],


    // @TODO(development): Remove the following development entries
    [
        '@dhis2/ui',
        [
            {
                name: '6.0.0-foo-bar-ui.js',
                path: resolveCodemod('ui'),
            },
            {
                name: '6.0.1-foo-ui.js',
                path: resolveCodemod('ui'),
            },
            {
                name: '6.0.2-bar-ui.js',
                path: resolveCodemod('ui'),
            },
        ]
    ],
]
