export function before(profil) {
    if (!profil.isComplete()) return 'conseils'
}

export function page(form, app, router) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Vous devez saisir l’un des choix proposés'

    const radios = [].slice.call(form.querySelectorAll('input[type=radio]'))

    function updateSubmitButtonLabelRequired() {
        if (!radios.some((radio) => radio.checked)) {
            button.disabled = true
            button.value = requiredLabel
        } else {
            let continueLabel
            const checkedRadio = radios.filter((radio) => radio.checked)[0]
            const okMedecin = checkedRadio.value === 'oui'
            if (app.profil.estMonProfil()) {
                if (okMedecin) {
                    continueLabel = 'Continuer vers mon suivi'
                } else {
                    continueLabel = 'Aller vers mes conseils'
                }
            } else {
                if (okMedecin) {
                    continueLabel = 'Continuer vers son suivi'
                } else {
                    continueLabel = 'Aller vers ses conseils'
                }
            }
            button.disabled = false
            button.value = continueLabel
        }
    }
    updateSubmitButtonLabelRequired()

    radios.forEach((radio) => {
        radio.addEventListener('change', updateSubmitButtonLabelRequired)
    })

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const medecin = event.target.elements['suivi_medecin'].value
        if (medecin === 'oui') {
            window.plausible(`Suivi medecin oui`)
            router.navigate('suividate')
        } else {
            window.plausible(`Suivi medecin non`)
            router.navigate('conseils')
        }
    })
}
