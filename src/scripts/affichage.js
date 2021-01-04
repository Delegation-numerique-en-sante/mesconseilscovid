export function showMeOrThem(element, profil) {
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

function showThem(themElement) {
    hideElement(themElement)
    showElement(themElement.nextSibling)
}

export function hideElement(element) {
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

export function showElement(element) {
    element.removeAttribute('hidden')
    element.classList.add('visible')
}

export function hideSelector(element, selector) {
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(element.querySelectorAll(selector), hideElement)
}

export function showSelector(element, selector) {
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(element.querySelectorAll(selector), showElement)
}

export function displayElementById(element, id) {
    var block = element.querySelector('#' + id)
    if (!block) return
    showElement(block)
}

export function displayBlocks(element, blockNames) {
    blockNames.forEach(function (block) {
        displayElementById(element, block)
    })
}

export function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstElementChild
}

export function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/`/g, '&#x60;')
}

export function safeHtml(literals, ...substitutions) {
    let result = ''

    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += escapeHtml(substitutions[i])
    }
    // add the last literal.
    result += literals[literals.length - 1]
    return result
}
