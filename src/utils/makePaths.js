const path = require('path')

module.exports.makePaths = cwd => {
    const NODE_MODULES = path.join(cwd, 'node_modules')
    return { NODE_MODULES }
}
