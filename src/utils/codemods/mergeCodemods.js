const mergeGroupIntoConfig = (config, group) => {
    const [moduleName, potentialCodemods] = group

    const existingIndex = config.findIndex(
        curGroup => curGroup[0] === moduleName
    )

    if (existingIndex === -1) {
        return [...config, [moduleName, potentialCodemods]]
    }

    // eslint-disable-next-line no-unused-vars
    const [_, existingCodemods] = config[existingIndex]

    const mergedCodemods = potentialCodemods.reduce(
        (accMergedCodemods, potentialCodemod) => {
            const alreadyExists = accMergedCodemods.findIndex(
                ({ name }) => name === potentialCodemod.name
            )

            if (alreadyExists === -1) {
                return [...accMergedCodemods, potentialCodemod]
            }

            accMergedCodemods.splice(alreadyExists, 1, potentialCodemod)
            return accMergedCodemods
        },
        existingCodemods
    )

    config[existingIndex] = [moduleName, mergedCodemods]

    return config
}

module.exports.mergeCodemods = (...codemodConfigs) => {
    // no initial value as we can start with the first entry
    return codemodConfigs.reduce((merged, codemodConfig) =>
        codemodConfig.reduce(mergeGroupIntoConfig, merged)
    )
}
