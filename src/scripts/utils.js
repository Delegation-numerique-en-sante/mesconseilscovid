export function heuresAvant(delta, start) {
    const from = start || new Date()
    return new Date(from.setHours(from.getHours() - delta))
}

export function joursAvant(delta, start) {
    const from = start || new Date()
    return new Date(from.setDate(from.getDate() - delta))
}

export function joursApres(delta, start) {
    const from = start || new Date()
    return new Date(from.setDate(from.getDate() + delta))
}
