const { config } = require('@dhis2/cli-style')
const husky = require(config.husky)

module.exports = {
    hooks: {
        ...husky.hooks,
        'pre-commit': 'd2-style js check --staged',
    },
}
