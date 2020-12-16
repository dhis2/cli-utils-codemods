/**
 * This replaces every occurrence of variable "foo".
 */
module.exports = function (fileInfo, api) {
    return api
        .jscodeshift(fileInfo.source)
        .findVariableDeclarators('foo')
        .renameTo('bar')
        .toSource()
}
