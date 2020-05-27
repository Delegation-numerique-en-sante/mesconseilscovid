function hideElement(element) {
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

function hideSelector(element, selector) {
    ;[].forEach.call(element.querySelectorAll(selector), hideElement)
}

function displayElement(element, id) {
    var block = element.querySelector('#' + id)
    block.removeAttribute('hidden')
    block.classList.add('visible')

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
        displayElement(element, block)
    })
}

function injectContent(element, content, selector) {
    var childElement = element.querySelector(selector)
    childElement.textContent = content
}

function injectAttribute(element, attrName, attrValue, selector) {
    var childElement = element.querySelector(selector)
    childElement.setAttribute(attrName, attrValue)
}

module.exports = {
    hideElement,
    hideSelector,
    displayElement,
    displayBlocks,
    injectContent,
    injectAttribute,
}
