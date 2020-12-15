const path = require('path')

module.exports.makePaths = cwd => {
    const DHIS2_NODE_MODULES = path.join(cwd, 'node_modules', '@dhis2')
    const LOCAL_CODEMODS = path.join(__dirname, '..', 'codemods')

    return { DHIS2_NODE_MODULES, LOCAL_CODEMODS }
}
