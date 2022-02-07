// Statistiques pour Mes Conseils Covid (Plausible)
export function registerPlausible(window: Window) {
    var location = window.location
    var document = window.document
    var plausibleHost = document.body.dataset.statsUrl

    var CONFIG = { domain: location.hostname }

    function ignore(reason: string) {
        console.warn('[Plausible] Ignore event: ' + reason)
    }

    function getUrl() {
        return (
            location.protocol +
            '//' +
            location.hostname +
            getLocationPathName() +
            location.search +
            getLocationHash()
        )
    }

    function getLocationHash() {
        if (location.pathname === '/') {
            return ''
        }
        return location.hash
    }

    function trigger(
        eventName: string,
        options: { props?: { source?: string }; callback?: Function }
    ) {
        let payload: {
            n?: string
            u?: string
            d?: string
            r?: string | null
            w?: number
            p?: string
        } = {}
        payload.n = eventName
        payload.u = getUrl()
        payload.d = CONFIG['domain']
        payload.r = document.referrer || null
        payload.w = window.innerWidth

        if (options && options.props) {
            payload.p = JSON.stringify(options.props)
        }

        if (
            /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^0\.0\.0\.0$|^(?:0*:)*?:?0*1$/.test(
                location.hostname
            ) ||
            location.protocol === 'file:'
        ) {
            ignore('running locally')
            let eventSummary = `${payload.n}:${getLocationPathName().slice(1)}`
            if (options && options.props && options.props.source) {
                eventSummary = `${eventSummary}:${options.props.source}`
            }
            window.app._plausibleTrackingEvents.push(eventSummary)
            console.debug('[Plausible]', JSON.stringify(payload))
            return
        }
        var request = new XMLHttpRequest()
        request.open('POST', plausibleHost + '/api/event', true)
        request.setRequestHeader('Content-Type', 'text/plain')

        request.send(JSON.stringify(payload))

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                options && options.callback && options.callback()
            }
        }
    }

    return trigger
}

// Modifie les URLs de la Single Page App ("/#foo" -> "/foo")
// pour faciliter l’exploitation par Plausible
export function getLocationPathName() {
    if (location.pathname === '/') {
        return '/' + location.hash.slice(1)
    }
    return location.pathname
}
