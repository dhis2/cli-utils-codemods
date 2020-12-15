const { run } = require('jscodeshift/src/Runner')

module.exports.exec = ({ transformFile, files, forward }) =>
    run(transformFile, files, forward)
