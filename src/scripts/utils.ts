export function joursAvant(delta: number, start?: Date): Date {
    const from = start || new Date()
    return new Date(from.setDate(from.getDate() - delta))
}

export function joursApres(delta: number, start?: Date): Date {
    const from = start || new Date()
    return new Date(from.setDate(from.getDate() + delta))
}

const _MS_PAR_JOUR = 1000 * 60 * 60 * 24

export function differenceEnJours(d1: Date, d2: Date): number {
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())

    return Math.floor((utc2 - utc1) / _MS_PAR_JOUR)
}

export function titleCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
