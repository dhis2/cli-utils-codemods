const path = require('path')

module.exports.getDhis2NodeModulesDir = cwd =>
    path.join(cwd, 'node_modules', '@dhis2')
