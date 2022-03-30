import { toggleElement } from '../../affichage'

export function initialiseLesDefinitions() {
    Array.from(document.querySelectorAll('button[aria-details^="def-"]')).forEach(
        (button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                const id = button.getAttribute('aria-details')
                if (id) {
                    const defn = document.getElementById(id)
                    if (defn) {
                        toggleElement(defn)
                        button.classList.toggle('open')
                    }
                }
            })
        }
    )
}
