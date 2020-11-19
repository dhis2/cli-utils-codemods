module.exports.getCodemodByPackageAndName = (package, name, availableCodemods) => {
    const group = availableCodemods.find(([packageName]) => packageName === package)

    if (!Array.isArray(group)) {
        return [ `Package '${package}' does not exist.` ]
    }

    const [_, codemods] = group
    const codemod = codemods.find(curCodemod => curCodemod.name === name)

    if (!codemod) {
        return [ `Package '${package}' does not contain a codemod named '${name}'.` ]
    }

    return [null, codemod]
}
