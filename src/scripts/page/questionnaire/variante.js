import { hideElement, showElement } from '../../affichage.js'

export function showVariante(varianteRadio) {
    showElement(varianteRadio)
    varianteRadio.classList.add('required')
    Array.from(varianteRadio.querySelectorAll('input[type=radio')).forEach((elem) => {
        elem.required = true
    })
}

export function hideVariante(varianteRadio) {
    hideElement(varianteRadio)
    varianteRadio.classList.remove('required')
    Array.from(varianteRadio.querySelectorAll('input[type=radio')).forEach((elem) => {
        elem.required = false
    })
}
