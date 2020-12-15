const path = require('path')

module.exports.makeAvailableCodemods = paths => {
    const resolveCodemod = pathSegments =>
        path.join(paths.LOCAL_CODEMODS, ...pathSegments.split('/'))

    return [
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
}
