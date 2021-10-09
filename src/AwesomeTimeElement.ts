import { registerRelativeTimeElement, unregisterRelativeTimeElement } from './TimeUpdateManager'
import { TimeUnit } from './utils'

export class AwesomeTimeElement extends HTMLElement {
  date?: Date
  relativeUntilDistanceDays = 4

  static get observedAttributes(): string[] {
    return ['datetime']
  }

  connectedCallback(): void {
    const datetime = this.getAttribute('datetime')
    if (!datetime) {
      return
    }
    this.date = new Date(Date.parse(datetime))
    registerRelativeTimeElement(this)
  }

  disconnectedCallback(): void {
    unregisterRelativeTimeElement(this)
  }

  attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
    if (attrName === 'datetime') {
      const millis = Date.parse(newValue)
      if (isNaN(millis)) {
        this.date = undefined
      } else {
        this.date = new Date(millis)
      }
    }

    const text = this.getFormattedDate()
    if (text) {
      this.textContent = text
    }
  }

  isRelativeTime(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    const differenceInMilli = this.date.valueOf() - today.valueOf()
    const daysInMilli = this.relativeUntilDistanceDays * 1000 * 60 * 60 * 24
    return Math.abs(differenceInMilli) < daysInMilli
  }

  isInFuture(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    return this.date.getTime() > today.getTime()
  }

  getUnitOfMeasurement(): [number, TimeUnit] {
    if (!this.date) {
      return [0, TimeUnit.Day]
    }
    const signedMilli = this.date.getTime() - new Date().getTime()
    const roundingFunc = signedMilli < 0 ? Math.floor : Math.ceil

    const ms = Math.abs(signedMilli)
    const sec = roundingFunc(ms / 1000)
    const min = roundingFunc(sec / 60)
    const hr = roundingFunc(min / 60)
    const day = roundingFunc(hr / 24)
    const month = roundingFunc(day / 30)
    const year = roundingFunc(month / 12)

    if (year > 1) {
      return [year, TimeUnit.Year]
    } else if (month > 1) {
      return [month, TimeUnit.Month]
    } else if (day > 1) {
      return [day, TimeUnit.Day]
    } else if (hr > 1) {
      return [hr, TimeUnit.Hour]
    } else if (min > 1) {
      return [min, TimeUnit.Minute]
    }
    return [sec, TimeUnit.Second]
  }

  getFormattedDate(): string {
    if ('Intl' in window && this.date !== undefined) {
      if (this.isRelativeTime()) {
        const formatter = new Intl.RelativeTimeFormat()
        const [length, unit] = this.getUnitOfMeasurement()
        const time = (this.isInFuture() ? 1 : -1) * length
        return formatter.format(time, unit)
      }
      const formatter = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      return formatter.format(this.date)
    }
    return ''
  }

  refreshDisplayTime(): void {
    this.textContent = this.getFormattedDate()

    const title = this.date?.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    })
    if (title) {
      this.title = title
    }
  }
}

if (!customElements.get('awesome-time')) {
  window.AwesomeTimeElement = AwesomeTimeElement
  customElements.define('awesome-time', AwesomeTimeElement)
}

declare global {
  interface Window {
    AwesomeTimeElement: typeof AwesomeTimeElement
  }
  interface HTMLElementTagNameMap {
    'awesome-time': AwesomeTimeElement
  }
}
