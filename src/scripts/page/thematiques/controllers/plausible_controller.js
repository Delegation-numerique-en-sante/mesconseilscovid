import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
    record(event) {
        window.app.plausible(event.params.eventName, event.params.props)
    }
}
