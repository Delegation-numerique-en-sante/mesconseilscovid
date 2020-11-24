import Pikaday from 'pikaday'

function isDateSupported() {
    const input = document.createElement('input')
    const value = 'a'
    input.setAttribute('type', 'date')
    input.setAttribute('value', value)
    return input.value !== value
}

export function addDatePickerPolyfill(field, minDate, maxDate) {
    if (!isDateSupported()) {
        new Pikaday({
            field: field,
            format: 'YYYY-M-D',
            toString(date) {
                const day = date.getDate()
                const month = date.getMonth() + 1
                const year = date.getFullYear()
                return `${year}-${month}-${day}`
            },
            parse(dateString) {
                const parts = dateString.split('-')
                const day = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const year = parseInt(parts[2], 10)
                return new Date(year, month, day)
            },
            minDate: minDate,
            maxDate: maxDate,
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
            theme: 'pika-mcc-theme',
        })
    }
}
