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

    // We avoid using the `document` global, as it is not available
    // when running unit tests in Node.
    // We also cannot use `element.getRootNode()` as it is not available
    // in Internet Explorer.
    var document_ = getRoot(element)

    var customDisplayEvent = document_.createEvent('CustomEvent')
    customDisplayEvent.initCustomEvent('elementDisplayed:' + id, true, true, block)
    document_.dispatchEvent(customDisplayEvent)
}

function getRoot(node) {
    if (node.parentNode != null) {
        return getRoot(node.parentNode)
    }
    return node
}

function displayBlocks(element, blockNames) {
    blockNames.forEach(function (block) {
        displayElementById(element, block)
    })
}

module.exports = {
    hideElement,
    showElement,
    hideSelector,
    displayElementById,
    displayBlocks,
}
