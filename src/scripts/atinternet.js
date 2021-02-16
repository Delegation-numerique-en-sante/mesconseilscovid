// Statistiques pour le Service d’Information du Gouvernement (ATInternet)
export function registerATInternet(window) {
    const host = 'https://logs1412.xiti.com'
    const siteID = 614871

    function ignore(reason) {
        console.warn('[ATInternet] Ignore event: ' + reason)
    }

    function trigger(pageName) {
        if (document.visibilityState === 'prerender') return ignore('prerendering')

        var payload = {}
        payload.s = siteID
        payload.ts = new Date().getTime()
        payload.idclient = 'Consent-NO'
        payload.p = pageName
        payload.s2 = ''

        if (location.hostname !== 'mesconseilscovid.sante.gouv.fr') {
            ignore('running locally')
            console.debug('[ATInternet]', payload)
            return
        }

        // URLSearchParams is not supported by IE.
        function formatParameters(params) {
            return (
                '?' +
                Object.keys(params)
                    .map((key) => key + '=' + encodeURIComponent(params[key]))
                    .join('&')
            )
        }

        const request = new XMLHttpRequest()
        request.open('GET', `${host}/hit.xiti${formatParameters(payload)}`, true)
        request.send(null)
    }

    window.atinternet = trigger
}
