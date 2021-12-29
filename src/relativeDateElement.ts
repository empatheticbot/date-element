import {
  registerRelativeTimeElement,
  unregisterRelativeTimeElement,
} from './TimeUpdateManager'
import {
  getRelativeRangeInMilliseconds,
  getSensibleRelativeUnitOfMeasurement,
  TimeUnit,
} from './utils'

export class RelativeDateElement extends HTMLElement {
  date?: Date

  static get observedAttributes(): string[] {
    return ['datetime', 'relative-range', 'relative-unit']
  }

  connectedCallback(): void {
    const datetime = this.getAttribute('datetime')
    if (datetime) {
      this.date = new Date(Date.parse(datetime))
    }
    registerRelativeTimeElement(this)
  }

  disconnectedCallback(): void {
    unregisterRelativeTimeElement(this)
  }

  getRelativeRange(): number {
    const relativeRange = this.getAttribute('relative-range')
    if (typeof relativeRange === 'string') {
      const asNumber = parseInt(relativeRange, 10)
      if (Number.isNaN(asNumber)) {
        return Infinity
      }
      return asNumber
    }
    return Infinity
  }

  getRelativeUnit(): TimeUnit {
    const relativeUnit = this.getAttribute('relative-unit')
    if (typeof relativeUnit === 'string') {
      return relativeUnit as TimeUnit
    }
    return TimeUnit.Hour
  }

  getRelativeMilliseconds(): number {
    return getRelativeRangeInMilliseconds(
      this.getRelativeRange(),
      this.getRelativeUnit()
    )
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ): void {
    if (attrName === 'datetime') {
      const millis = Date.parse(newValue)
      if (isNaN(millis)) {
        this.date = undefined
      } else {
        this.date = new Date(millis)
      }
    }
    this.refreshDisplayTime()
  }

  isRelativeTime(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    const differenceInMilli = this.date.valueOf() - today.valueOf()
    return Math.abs(differenceInMilli) < this.getRelativeMilliseconds()
  }

  isInFuture(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    return this.date.getTime() > today.getTime()
  }

  isNow(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    return Math.abs(today.getTime() - this.date.getTime()) < 1000 * 60 * 2
  }

  getDefaultDateText(): string {
    const formatter = Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return formatter.format(this.date)
  }

  getFormattedDate(): string {
    if ('Intl' in window && this.date !== undefined) {
      if (this.isRelativeTime()) {
        const formatter = new Intl.RelativeTimeFormat()
        const [length, unit] = getSensibleRelativeUnitOfMeasurement(this.date)
        const time = (this.isInFuture() ? 1 : -1) * length
        return formatter.format(time, unit)
      }
      return this.getDefaultDateText()
    }
    return ''
  }

  refreshDisplayTime(): void {
    if (this.date) {
      this.textContent = this.getFormattedDate()
    }
    const title = this.date?.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    })
    if (title) {
      this.title = title
    }
    this.classList.toggle('now', this.isNow())
  }
}

if (!customElements.get('relative-date')) {
  window.RelativeDateElement = RelativeDateElement
  customElements.define('relative-date', RelativeDateElement)
}

declare global {
  interface Window {
    RelativeDateElement: typeof RelativeDateElement
  }
  interface HTMLElementTagNameMap {
    'relative-date': RelativeDateElement
  }
}
