/* Inspired by https://github.com/nwcell/ics.js */

export default class ICS {
    constructor(appVersion) {
        this.uidDomain = 'default'
        this.prodId = 'Calendar'
        this.SEPARATOR = appVersion.indexOf('Win') !== -1 ? '\r\n' : '\n'
        this.calendarEvents = []
        this.calendarStart = [
            'BEGIN:VCALENDAR',
            'PRODID:' + this.prodId,
            'VERSION:2.0',
        ].join(this.SEPARATOR)
        this.calendarEnd = this.SEPARATOR + 'END:VCALENDAR'
    }

    addEvent(subject, description, startDate, duration, rrule, now) {
        const endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + duration)
        const dates = this.generateDates(startDate, endDate, now)
        const rruleString = this.generateRRule(rrule)

        let calendarEvent = [
            'BEGIN:VEVENT',
            'UID:' + this.calendarEvents.length + '@' + this.uidDomain,
            'CLASS:PUBLIC',
            'DESCRIPTION:' + description,
            'DTSTAMP;VALUE=DATE-TIME:' + dates.now,
            'DTSTART;VALUE=DATE-TIME:' + dates.start,
            'DTEND;VALUE=DATE-TIME:' + dates.end,
            'SUMMARY;LANGUAGE=fr-fr:' + subject,
            'TRANSP:TRANSPARENT',
            'END:VEVENT',
        ]

        if (rruleString) {
            calendarEvent.splice(4, 0, rruleString)
        }

        calendarEvent = calendarEvent.join(this.SEPARATOR)

        this.calendarEvents.push(calendarEvent)
        return calendarEvent
    }

    generateCalendar() {
        return (
            this.calendarStart +
            this.SEPARATOR +
            this.calendarEvents.join(this.SEPARATOR) +
            this.calendarEnd
        )
    }

    generateDates(startDate, endDate, now) {
        // TODO: add time and time zone? use moment to format?
        const nowDate = now || new Date()

        const start_year = ('0000' + startDate.getFullYear().toString()).slice(-4)
        const start_month = ('00' + (startDate.getMonth() + 1).toString()).slice(-2)
        const start_day = ('00' + startDate.getDate().toString()).slice(-2)
        const start_hours = ('00' + startDate.getHours().toString()).slice(-2)
        const start_minutes = ('00' + startDate.getMinutes().toString()).slice(-2)
        const start_seconds = ('00' + startDate.getMinutes().toString()).slice(-2)

        const end_year = ('0000' + endDate.getFullYear().toString()).slice(-4)
        const end_month = ('00' + (endDate.getMonth() + 1).toString()).slice(-2)
        const end_day = ('00' + endDate.getDate().toString()).slice(-2)
        const end_hours = ('00' + endDate.getHours().toString()).slice(-2)
        const end_minutes = ('00' + endDate.getMinutes().toString()).slice(-2)
        const end_seconds = ('00' + endDate.getMinutes().toString()).slice(-2)

        const now_year = ('0000' + nowDate.getFullYear().toString()).slice(-4)
        const now_month = ('00' + (nowDate.getMonth() + 1).toString()).slice(-2)
        const now_day = ('00' + nowDate.getDate().toString()).slice(-2)
        const now_hours = ('00' + nowDate.getHours().toString()).slice(-2)
        const now_minutes = ('00' + nowDate.getMinutes().toString()).slice(-2)
        const now_seconds = ('00' + nowDate.getSeconds().toString()).slice(-2)

        // Since some calendars don't add 0 second events,
        // we need to remove time if there is none.
        let start_time = ''
        let end_time = ''
        if (
            start_hours +
                start_minutes +
                start_seconds +
                end_hours +
                end_minutes +
                end_seconds !=
            0
        ) {
            start_time = 'T' + start_hours + start_minutes + start_seconds
            end_time = 'T' + end_hours + end_minutes + end_seconds
        }
        const now_time = 'T' + now_hours + now_minutes + now_seconds
        return {
            start: start_year + start_month + start_day + start_time,
            end: end_year + end_month + end_day + end_time,
            now: now_year + now_month + now_day + now_time,
        }
    }

    generateRRule(rrule) {
        let rruleString
        if (rrule) {
            if (rrule.rrule) {
                rruleString = rrule.rrule
            } else {
                rruleString = 'RRULE:FREQ=' + rrule.freq
                rruleString += ';INTERVAL=' + rrule.interval
                rruleString += ';COUNT=' + rrule.count
            }
        }
        return rruleString
    }
}
