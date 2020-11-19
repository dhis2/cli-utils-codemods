const path = require('path')

module.exports.resolveCodemod = pathSegments => path.join(
    __dirname,
    '..',
    '..',
    'codemods',
    ...pathSegments.split('/')
)
