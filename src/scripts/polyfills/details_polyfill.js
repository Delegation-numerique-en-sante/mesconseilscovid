/* Inspired from https://github.com/rstacruz/details-polyfill */
export default function applyDetailsSummaryPolyfill(element) {
    const DETAILS = 'details'
    const SUMMARY = 'summary'

    function checkSupport() {
        const el = document.createElement(DETAILS)
        if (!('open' in el)) return false

        el.innerHTML = '<' + SUMMARY + '>a</' + SUMMARY + '>b'
        document.body.appendChild(el)

        const diff = el.offsetHeight
        el.open = true
        const result = diff != el.offsetHeight

        document.body.removeChild(el)
        return result
    }

    const supported = checkSupport()
    if (supported) {
        return
    }
    // Click handler for `<summary>` tags
    Array.from(element.querySelectorAll('details summary')).forEach((summary) => {
        summary.addEventListener('click', (event) => {
            event.preventDefault()
            let details = event.target
            while (details.tagName.toLowerCase() !== DETAILS) {
                details = details.parentElement
            }
            if (details.hasAttribute('open') || details.open) {
                details.open = false
                details.removeAttribute('open')
            } else {
                details.open = true
                details.setAttribute('open', 'open')
            }
        })
    })
}
