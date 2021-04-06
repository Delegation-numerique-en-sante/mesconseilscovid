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

const _MS_PAR_JOUR = 1000 * 60 * 60 * 24

export function differenceEnJours(d1, d2) {
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())

    return Math.floor((utc2 - utc1) / _MS_PAR_JOUR)
}

export function slugify(string) {
    /* Adapted from
    https://mhagemann.medium.com/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1 */
    const a =
        'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b =
        'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/’/g, "'") // Turn apostrophes to single quotes
        .replace(/[^a-zA-Z0-9-']+/g, '') // Remove all non-word characters except single quotes
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}
