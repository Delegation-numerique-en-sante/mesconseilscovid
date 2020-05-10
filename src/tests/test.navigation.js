describe('navigation', function () {
    it('page inconnue renvoie au début', function () {
        chai.expect(navigation.redirectIfMissingData('foo')).to.equal('introduction')
    })
})
