import actions from '../actions.js'

function page(element, app) {
    const container = element.querySelector('#timeline')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(app.profil.renderHistorique(), container.firstChild)
    actions.bindImpression(element)
}

module.exports = { page }
