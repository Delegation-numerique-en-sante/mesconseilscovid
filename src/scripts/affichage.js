function showMeOrThem(element, profil) {
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        element.querySelectorAll('.me'),
        profil.estMonProfil() ? showMe : showThem
    )
}

function showMe(meElement) {
    showElement(meElement)
    hideElement(meElement.nextSibling)
}

function showThem(meElement) {
    hideElement(meElement)
    showElement(meElement.nextSibling)
}

function hideElement(element) {
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

function showElement(element) {
    element.removeAttribute('hidden')
    element.classList.add('visible')
}

function hideSelector(element, selector) {
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(element.querySelectorAll(selector), hideElement)
}

function displayElementById(element, id) {
    var block = element.querySelector('#' + id)
    if (!block) return
    showElement(block)
}

function displayBlocks(element, blockNames) {
    blockNames.forEach(function (block) {
        displayElementById(element, block)
    })
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstElementChild
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/`/g, '&#x60;')
}

function safeHtml(literals, ...substitutions) {
    let result = ''

    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += escapeHtml(substitutions[i])
    }
    // add the last literal
    result += literals[literals.length - 1]
    return result
}

module.exports = {
    showMeOrThem,
    hideElement,
    showElement,
    hideSelector,
    displayElementById,
    displayBlocks,
    createElementFromHTML,
    safeHtml,
    escapeHtml,
}
