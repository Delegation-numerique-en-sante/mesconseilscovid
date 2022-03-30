export function showMeOrThem(element, profil) {
    const func = profil.estMonProfil() ? showMe : showThem
    Array.from(element.querySelectorAll('.me')).forEach(func)
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
    if (!element) return
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

export function showElement(element) {
    if (!element) return
    element.removeAttribute('hidden')
    element.classList.add('visible')
}

export function toggleElement(element) {
    if (!element) return
    if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden')
    } else {
        element.setAttribute('hidden', '')
    }
    element.classList.toggle('visible')
}

export function hideSelector(element, selector) {
    Array.from(element.querySelectorAll(selector)).forEach(hideElement)
}

export function showSelector(element, selector) {
    Array.from(element.querySelectorAll(selector)).forEach(showElement)
}

export function showOnlyIf(element, selector, condition) {
    if (condition) {
        // on laisse les blocs affichés
    } else {
        hideSelector(element, selector)
    }
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

export function cloneElementInto(sourceElement, targetElement) {
    const clone = sourceElement.cloneNode(true)
    targetElement.innerHTML = ''
    while (clone.firstElementChild) {
        targetElement.insertAdjacentElement('beforeend', clone.firstElementChild)
    }
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
