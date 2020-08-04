var assert = require('chai').assert

var ICS = require('../ics.js').ICS

describe('ICS', function () {
    it('On génère un ics sans rrule', function () {
        const ics = new ICS('5.0 (Macintosh)')
        const startDate = new Date(2020, 7, 3, 12)
        const endDate = new Date(2020, 7, 3, 13)
        const now = startDate // To be able to test.
        const rrule = undefined
        ics.addEvent(
            'Suivi COVID19',
            'Aller faire mon suivi quotidien sur https://mesconseilscovid.sante.gouv.fr/#suiviintroduction',
            startDate,
            endDate,
            rrule,
            now
        )
        assert.strictEqual(
            ics.generateCalendar(),
            `\
BEGIN:VCALENDAR
PRODID:Calendar
VERSION:2.0
BEGIN:VEVENT
UID:0@default
CLASS:PUBLIC
DESCRIPTION:Aller faire mon suivi quotidien sur https://mesconseilscovid.sante.gouv.fr/#suiviintroduction
DTSTAMP;VALUE=DATE-TIME:20200803T120000
DTSTART;VALUE=DATE-TIME:20200803T120000
DTEND;VALUE=DATE-TIME:20200803T130000
SUMMARY;LANGUAGE=fr-fr:Suivi COVID19
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR`
        )
    })

    it('On génère un ics avec rrule', function () {
        const ics = new ICS('5.0 (Macintosh)')
        const startDate = new Date(2020, 7, 3, 12)
        const endDate = new Date(2020, 7, 3, 13)
        const now = startDate // To be able to test.
        const rrule = {
            freq: 'DAILY',
            interval: 1,
            count: 15,
        }
        ics.addEvent(
            'Suivi COVID19',
            'Aller faire mon suivi quotidien sur https://mesconseilscovid.sante.gouv.fr/#suiviintroduction',
            startDate,
            endDate,
            rrule,
            now
        )
        assert.strictEqual(
            ics.generateCalendar(),
            `\
BEGIN:VCALENDAR
PRODID:Calendar
VERSION:2.0
BEGIN:VEVENT
UID:0@default
CLASS:PUBLIC
DESCRIPTION:Aller faire mon suivi quotidien sur https://mesconseilscovid.sante.gouv.fr/#suiviintroduction
RRULE:FREQ=DAILY;INTERVAL=1;COUNT=15
DTSTAMP;VALUE=DATE-TIME:20200803T120000
DTSTART;VALUE=DATE-TIME:20200803T120000
DTEND;VALUE=DATE-TIME:20200803T130000
SUMMARY;LANGUAGE=fr-fr:Suivi COVID19
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR`
        )
    })
})
