const { run } = require('jscodeshift/src/Runner')

module.exports.exec = ({
    transformFile,
    positionalArguments,
}) => run(transformFile, positionalArguments, {})

