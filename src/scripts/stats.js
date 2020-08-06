import { fetch } from 'whatwg-fetch'

function ping(pageName) {
    // https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
    fetch(`/stats/${pageName}`, {
        referrerPolicy: 'unsafe-url',
        cache: 'no-cache',
        headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
        },
    })
        .then((response) => {
            console.debug(`Stats: ${pageName} (${response.status})`)
        })
        .catch((exception) => {
            console.warn(`Stats: ${pageName} (${exception})`)
        })
}

module.exports = {
    ping,
}
