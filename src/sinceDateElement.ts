import { RelativeDateElement } from './relativeDateElement'

export class SinceDateElement extends RelativeDateElement {
  isRelativeTime(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    const timeSinceNow = today.valueOf() - this.date.valueOf()
    return timeSinceNow > 1000 * 60 * 2
  }

  getDefaultDateText(): string {
    return 'just now'
  }

  isNow(): boolean {
    return !this.isRelativeTime()
  }
}

if (!customElements.get('since-date')) {
  window.SinceDateElement = SinceDateElement
  // eslint-disable-next-line custom-elements/extends-correct-class
  customElements.define('since-date', SinceDateElement)
}

declare global {
  interface Window {
    SinceDateElement: typeof SinceDateElement
  }
  interface HTMLElementTagNameMap {
    'since-date': SinceDateElement
  }
}
