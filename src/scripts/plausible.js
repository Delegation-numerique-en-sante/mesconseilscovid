// Statistiques pour Mes Conseils Covid (Plausible)
export function registerPlausible(window) {
    var location = window.location
    var document = window.document
    var plausibleHost = document.body.dataset.statsUrl

    var CONFIG = { domain: location.hostname }

    function ignore(reason) {
        console.warn('[Plausible] Ignore event: ' + reason)
    }

    function getUrl() {
        return location.toString()
    }

    function trigger(eventName, options) {
        if (document.visibilityState === 'prerender') return ignore('prerendering')

        var payload = {}
        payload.n = eventName
        payload.u = getUrl()
        payload.d = CONFIG['domain']
        payload.r = document.referrer || null
        payload.w = window.innerWidth

        if (options && options.pageName) {
            payload.u = `/${options.pageName}`
        }

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
            const pageName = (options && options.pageName) || location.pathname.slice(1)
            window.app._plausibleTrackingEvents.push(`${payload.n}:${pageName}`)
            console.debug('[Plausible]', payload)
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
