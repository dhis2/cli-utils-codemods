const path = require('path')

module.exports.makePaths = cwd => {
    const PACKAGE_JSON = path.join(cwd, 'package.json')
    return { cwd, PACKAGE_JSON }
}
