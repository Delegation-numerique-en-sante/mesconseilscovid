import { hideElement, toggleElement } from '../../affichage'

export function initialiseLesDefinitions() {
    Array.from(document.querySelectorAll('button[aria-details^="def-"]')).forEach(
        (button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                const id = button.getAttribute('aria-details')
                if (id) {
                    toggleElement(document.getElementById(id))
                }
            })
        }
    )
    Array.from(document.querySelectorAll('button[data-close]')).forEach((button) => {
        button.addEventListener('click', (event) => {
            hideElement(event.target.closest('[role="tooltip"]'))
        })
    })
}
