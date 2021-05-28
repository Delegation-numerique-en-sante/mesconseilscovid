export default class Page {
    constructor(app) {
        this.app = app
    }
    trackEvent(eventName) {
        this.app.trackEvent(eventName, this.pageName)
    }
}
