const path = require('path')

module.exports.makePaths = cwd => {
    const DHIS2_NODE_MODULES = path.join(cwd, 'node_modules', '@dhis2')

    return { DHIS2_NODE_MODULES }
}
