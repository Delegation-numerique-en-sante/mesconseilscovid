// Polyfill for CustomEvent support on IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
// eslint-disable-next-line no-extra-semi
;(function () {
    if (typeof window.CustomEvent === 'function') return false

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null }
        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }

    window.CustomEvent = CustomEvent
})()
