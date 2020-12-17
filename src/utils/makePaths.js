const path = require('path')

module.exports.makePaths = cwd => {
    const PACKAGE_JSON = path.join(cwd, 'package.json')
    return { PACKAGE_JSON }
}
