describe('Carte départements', function () {
    it('Il y a le bon nombre de noms', function () {
        chai.expect(Object.keys(carteDepartements._noms).length).to.equal(104)
    })
    it('On récupère le nom depuis le département', function () {
        chai.expect(carteDepartements.nom('01')).to.equal('Ain')
    })
    it('Il y a (presque) le bon nombre de couleurs', function () {
        // Manque Saint-Pierre-et-Miquelon, Saint-Barthélemy et Saint-Martin.
        chai.expect(Object.keys(carteDepartements._couleurs).length).to.equal(101)
    })
    it('On récupère la couleur verte depuis le département', function () {
        chai.expect(carteDepartements.couleur('01')).to.equal('vert')
    })
    it('On récupère la couleur rouge depuis le département', function () {
        chai.expect(carteDepartements.couleur('02')).to.equal('rouge')
    })
    it('On récupère la couleur inconnue si on n’a pas la donnée', function () {
        chai.expect(carteDepartements.couleur('977')).to.equal('inconnue')
    })
    it('Il y a le bon nombre de liens vers les préféctures', function () {
        chai.expect(Object.keys(carteDepartements._liens_prefectures).length).to.equal(
            104
        )
    })
    it('On récupère le lien vers la préfecture depuis le département', function () {
        chai.expect(carteDepartements.lien_prefecture('01')).to.equal(
            'http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html'
        )
    })
})
