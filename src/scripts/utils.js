function joursAvant(delta, start) {
    const from = start || new Date()
    return new Date(from.setDate(from.getDate() - delta))
}

module.exports = {
    joursAvant,
}
