import playwright from 'playwright'

let browser

before(async function () {
    // Lance un navigateur « headless » (définir la variable
    // d’environnement PWDEBUG=1 pour afficher le navigateur)
    browser = await playwright[process.env.npm_config_browser].launch()
})

after(async function () {
    await browser.close()
})

beforeEach(async function () {
    // Chaque test tourne dans un nouvel onglet.
    this.currentTest.page = await browser.newPage()
})

afterEach(async function () {
    await this.currentTest.page.close()
})
