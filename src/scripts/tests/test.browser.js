const assert = require('assert')
const { chromium } = require('playwright')
const http = require('http')
const static = require('node-static')

describe('Scénarios navigateur', function () {
    // Lance un serveur HTTP
    let server
    before(() => {
        let file = new static.Server('./dist')
        server = http.createServer(function (request, response) {
            request
                .addListener('end', function () {
                    file.serve(request, response)
                })
                .resume()
        })
        server.listen(8080)
    })
    after(() => {
        server.close()
    })

    // Lance un navigateur « headless »
    let browser
    before(async () => {
        browser = await chromium.launch({ headless: true })
    })
    after(async () => {
        await browser.close()
    })

    // Chaque test tourne dans un nouvel onglet
    let page
    beforeEach(async () => {
        page = await browser.newPage()
    })
    afterEach(async () => {
        await page.close()
    })

    it('titre de la page', async () => {
        await page.goto('http://localhost:8080/')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )
    })
})
