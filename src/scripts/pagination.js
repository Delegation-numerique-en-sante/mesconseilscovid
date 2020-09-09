import { showMeOrThem } from './affichage.js'

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

    if (app) {
        showMeOrThem(element, app.profil)
    }

    if (pageName !== 'introduction') {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    return element
}
