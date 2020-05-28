module.exports = {
    setup: function (element) {
        var printButton = element.querySelector('#impression')
        printButton.addEventListener('click', function (event) {
            event.preventDefault()
            try {
                window.print()
            } catch {
                alert('Cette fonctionnalité n’est pas présente sur votre appareil')
            }
        })
    },
}
