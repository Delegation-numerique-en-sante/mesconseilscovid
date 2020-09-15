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

    // Enregistrement des évènements de Plausible
    const plausibleTrackingNames = []
    this.currentTest.page.on('console', function (msg) {
        const args = msg.args()
        if (args.length === 0) return
        if (args[0]._value === '[Plausible]')
            plausibleTrackingNames.push(JSON.parse(args[1]._value).name)
    })
    this.currentTest.plausibleTrackingNames = plausibleTrackingNames
})

afterEach(async function () {
    await this.currentTest.page.close()
})
