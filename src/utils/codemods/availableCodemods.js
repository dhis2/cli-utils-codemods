const { resolveCodemod } = require('./resolveCodemod')

module.exports.availableCodemods = [
    // contains groups that apply to mutliple repositories
    ['multi-purpose', []],

    // these should be moved to the respective repository
    [
        '@dhis2/d2-ui',
        [
            {
                name: '31.1.0-change-imports.js',
                path: resolveCodemod('d2-ui'),
            },
        ],
    ],
]
