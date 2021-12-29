import { RelativeDateElement } from './relativeDateElement'

export class UntilDateElement extends RelativeDateElement {
  isRelativeTime(): boolean {
    return this.isInFuture()
  }

  getDefaultDateText(): string {
    return 'now'
  }

  isNow(): boolean {
    return !this.isRelativeTime()
  }
}

if (!customElements.get('until-date')) {
  window.UntilDateElement = UntilDateElement
  // eslint-disable-next-line custom-elements/extends-correct-class
  customElements.define('until-date', UntilDateElement)
}

declare global {
  interface Window {
    UntilDateElement: typeof UntilDateElement
  }
  interface HTMLElementTagNameMap {
    'until-date': UntilDateElement
  }
}
