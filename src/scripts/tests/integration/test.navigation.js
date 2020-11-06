import { waitForPlausibleTrackingEvents } from './helpers.js'

describe('Navigation', function () {
    it('Les paramètres source sont retirés', async function () {
        const page = this.test.page

        await Promise.all([
            page.goto('http://localhost:8080/?source=Toto&truc=machin'),
            page.waitForNavigation({ url: '**/?truc=machin#introduction' }),
        ])
        await waitForPlausibleTrackingEvents(page, [
            'pageview::Toto',
            'pageview:introduction',
        ])
    })
})
