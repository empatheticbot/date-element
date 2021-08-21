import {registerRelativeTimeElement, unregisterRelativeTimeElement} from './TimeUpdateManager'
import {TimeUnit} from './utils'

export class AwesomeTimeElement extends HTMLElement {
  date?: Date
  relativeUntilDistanceDays = 3

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

    const ms = Math.abs(this.date.getTime() - new Date().getTime())
    const sec = Math.floor(ms / 1000)
    const min = Math.floor(sec / 60)
    const hr = Math.floor(min / 60)
    const day = Math.floor(hr / 24)
    const month = Math.floor(day / 30)
    const year = Math.floor(month / 12)

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
    if (!this.date) {
      return ''
    }
    if ('Intl' in window && this.date) {
      if (this.isRelativeTime) {
        const formatter = new Intl.RelativeTimeFormat()
        const [length, unit] = this.getUnitOfMeasurement()
        const time = (this.isInFuture() ? 1 : -1) * length
        return formatter.format(time, unit)
      }
      const formatter = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short'
      })
      formatter.format(this.date)
    }
    return ''
  }

  refreshDisplayTime(): void {
    this.textContent = this.getFormattedDate()

    const title = this.date?.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    })
    if (title) {
      this.title = title
    }
  }
}

if (!customElements.get('awesome-time')) {
  customElements.define('awesome-time', AwesomeTimeElement)
}
