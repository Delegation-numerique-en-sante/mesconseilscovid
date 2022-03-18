import { Controller } from '@hotwired/stimulus'
import type { ActionEvent } from '@hotwired/stimulus'

export default class extends Controller {
    record(event: ActionEvent) {
        window.app.plausible(
            event.params.eventName as unknown,
            event.params.props as unknown
        )
    }
}
