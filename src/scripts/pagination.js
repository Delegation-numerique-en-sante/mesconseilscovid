import { showMeOrThem } from './affichage'

export function getCurrentPageName() {
    return document.location.pathname.slice(1)
}

export function loadPage(pageName, app) {
    var page = document.querySelector('section#page')
    var section = document.querySelector('#' + pageName)
    var clone = section.cloneNode(true)
    page.classList.remove('ready')
    page.classList.add('loading')
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
