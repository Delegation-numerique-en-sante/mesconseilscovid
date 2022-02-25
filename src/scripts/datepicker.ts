import Pikaday from 'pikaday'

function isDateSupported() {
    const input = document.createElement('input')
    const value = 'a'
    input.setAttribute('type', 'date')
    input.setAttribute('value', value)
    return input.value !== value
}

export function formatDate(date: Date | undefined) {
    if (typeof date === 'undefined') return ''
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return year + '-' + pad(month) + '-' + pad(day)
}

function pad(number: number) {
    if (number < 10) {
        return '0' + number
    }
    return number
}

export function addDatePickerPolyfill(
    field: HTMLElement,
    maxDate: Date | undefined,
    onUpdate?: (() => void)
) {
    if (!isDateSupported()) {
        new Pikaday({
            field: field,
            format: 'YYYY-MM-DD',
            toString(date: Date) {
                return formatDate(date)
            },
            parse(dateString: string) {
                const parts = dateString.split('-')
                const year = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const day = parseInt(parts[2], 10)
                return new Date(year, month, day)
            },
            maxDate: maxDate,
            onSelect: onUpdate,
            onOpen: onUpdate,
            onClose: onUpdate,
            firstDay: 1, // Semaine débute le lundi.
            i18n: {
                previousMonth: 'Mois précédent',
                nextMonth: 'Mois suivant',
                months: [
                    'Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septembre',
                    'Octobre',
                    'Novembre',
                    'Décembre',
                ],
                weekdays: [
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                ],
                weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            },
            ariaLabel: 'Utilisez les flèches pour choisir une date',
            theme: 'pika-mcc-theme',
        })
    }
}
