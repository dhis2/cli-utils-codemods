module.exports.getCodemodByPackageAndName = (pkg, name, availableCodemods) => {
    const group = availableCodemods.find(([packageName]) => packageName === pkg)

    if (!Array.isArray(group)) {
        return [`Package '${pkg}' does not exist.`]
    }

    // eslint-disable-next-line no-unused-vars
    const [_, codemods] = group
    const codemod = codemods.find(curCodemod => curCodemod.name === name)

    if (!codemod) {
        return [`Package '${pkg}' does not contain a codemod named '${name}'.`]
    }

    return [null, codemod]
}
