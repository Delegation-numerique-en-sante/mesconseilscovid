import { Controller as StimulusController } from '@hotwired/stimulus'

export default class Controller<
    StimulusElement extends Element = Element
> extends StimulusController {
    // @ts-ignore see https://discuss.hotwired.dev/t/stimulus-and-typescript/2458
    declare readonly element: StimulusElement
}
