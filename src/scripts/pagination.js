import { showMeOrThem } from './affichage'

export function getCurrentPageName() {
    var hash = document.location.hash
    var fragment = hash ? hash.slice(1) : ''
    return fragment.split('?')[0]
}

export function loadPage(pageName, app) {
    var page = document.querySelector('section#page')
    var section = document.querySelector('#' + pageName)
    var clone = section.cloneNode(true)
    page.innerHTML = '' // Flush the current content.
    var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)
    showMeOrThem(element, app.profil)
    scrollToTopOfPage()
    return element
}

function scrollToTopOfPage() {
    if (typeof document.documentElement.scrollTo === 'function') {
        document.documentElement.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    } else {
        document.documentElement.scrollTop = 0
    }
}
