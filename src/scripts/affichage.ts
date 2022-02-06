import type Profil from './profil'

export function showMeOrThem(element: HTMLElement, profil: Profil) {
    const func = profil.estMonProfil() ? showMe : showThem
    const elements: HTMLElement[] | [] = Array.from(element.querySelectorAll('.me'))
    elements.forEach(func)
}

function showMe(meElement: HTMLElement) {
    showElement(meElement)
    hideElement(meElement.nextSibling as HTMLElement)
}

function showThem(themElement: HTMLElement) {
    hideElement(themElement)
    showElement(themElement.nextSibling as HTMLElement)
}

export function hideElement(element: HTMLElement | null) {
    if (!element) return
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

export function showElement(element: HTMLElement | null) {
    if (!element) return
    element.removeAttribute('hidden')
    element.classList.add('visible')
}

export function hideSelector(element: HTMLElement, selector: string) {
    const elements: HTMLElement[] | [] = Array.from(element.querySelectorAll(selector))
    elements.forEach(hideElement)
}

export function showSelector(element: HTMLElement, selector: string) {
    const elements: HTMLElement[] | [] = Array.from(element.querySelectorAll(selector))
    elements.forEach(showElement)
}

export function showOnlyIf(element: HTMLElement, selector: string, condition: boolean) {
    if (condition) {
        // on laisse les blocs affichés
    } else {
        hideSelector(element, selector)
    }
}

export function displayElementById(element: HTMLElement, id: string) {
    var block: HTMLElement | null = element.querySelector('#' + id)
    if (!block) return
    showElement(block)
}

export function displayBlocks(element: HTMLElement, blockNames: string[]) {
    blockNames.forEach(function (block) {
        displayElementById(element, block)
    })
}

export function createElementFromHTML(htmlString: string) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstElementChild
}

export function cloneElementInto(
    sourceElement: HTMLElement,
    targetElement: HTMLElement
) {
    const clone = sourceElement.cloneNode(true)
    targetElement.innerHTML = ''
    while (clone.firstElementChild) {
        targetElement.insertAdjacentElement('beforeend', clone.firstElementChild)
    }
}

export function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/`/g, '&#x60;')
}

export function safeHtml(literals: TemplateStringsArray, ...substitutions: string[]) {
    let result = ''

    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += escapeHtml(substitutions[i])
    }
    // add the last literal.
    result += literals[literals.length - 1]
    return result
}
