describe('Injection', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Injection des informations relatives aux départements', function () {
        var element = document.createElement('div')
        element.innerHTML = `
            <strong id="nom-departement"></strong>
            <a href="#conseils-departement" id="lien-prefecture">Site</a>
        `
        var data = {
            departement: '01',
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        var data = algorithme.getData()

        injectionScripts.departements(element, data)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-departement">Ain</strong>
            <a href="http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html" id="lien-prefecture">Site</a>
        `)
    })
})
