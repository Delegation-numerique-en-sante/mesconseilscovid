import affichage from './affichage'

var getCurrentPageName = function () {
    var hash = document.location.hash
    var fragment = hash ? hash.slice(1) : ''
    return fragment.split('?')[0]
}

var loadPage = function (pageName, app) {
    var page = document.querySelector('section#page')
    var section = document.querySelector('#' + pageName)
    var clone = section.cloneNode(true)
    page.innerHTML = '' // Flush the current content.
    var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)

    if (app) {
        affichage.showMeOrThem(element, app.profil)
    }

    if (pageName !== 'introduction') {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    return element
}

export default {
    getCurrentPageName,
    loadPage,
}
