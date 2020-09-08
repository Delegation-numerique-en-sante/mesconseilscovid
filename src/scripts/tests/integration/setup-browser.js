import playwright from 'playwright'

let browser

before(async function () {
    // Lance un navigateur « headless »
    browser = await playwright[process.env.npm_config_browser].launch({
        headless: true,
    })
})

after(async function () {
    await browser.close()
})

beforeEach(async function () {
    // Chaque test tourne dans un nouvel onglet
    this.currentTest.page = await browser.newPage()
})

afterEach(async function () {
    await this.currentTest.page.close()
})
