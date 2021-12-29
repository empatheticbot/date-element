import {
  registerRelativeTimeElement,
  unregisterRelativeTimeElement,
} from './TimeUpdateManager'
import { TimeUnit } from './utils'

enum RelativeUnitOfTime {
  Years = 'years',
  Months = 'months',
  Weeks = 'weeks',
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export class AwesomeTimeElement extends HTMLElement {
  date?: Date
  relativeUnitOfTime?: RelativeUnitOfTime
  relativeRangeInMilli?: number

  static get observedAttributes(): string[] {
    return ['datetime', 'relative-range', 'relative-unit']
  }

  connectedCallback(): void {
    const datetime = this.getAttribute('datetime')
    if (!datetime) {
      return
    }
    const relativeRange = this.getAttribute('relative-range') || '48'
    const relativeUnit =
      (this.getAttribute('relative-unit') as RelativeUnitOfTime) ||
      RelativeUnitOfTime.Hours
    if (relativeRange && typeof parseInt(relativeRange, 10) === 'number') {
      this.relativeRangeInMilli = this.getRelativeRangeInMilliseconds(
        parseInt(relativeRange, 10),
        relativeUnit
      )
    }
    this.date = new Date(Date.parse(datetime))
    registerRelativeTimeElement(this)
  }

  disconnectedCallback(): void {
    unregisterRelativeTimeElement(this)
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
    } else if (attrName === 'relative-range') {
      if (newValue && typeof parseInt(newValue, 10) === 'number') {
        this.relativeRangeInMilli = this.getRelativeRangeInMilliseconds(
          parseInt(newValue, 10),
          this.relativeUnitOfTime || RelativeUnitOfTime.Hours
        )
      }
    } else if (attrName === 'relative-unit') {
      const relativeRange = this.getAttribute('relative-range') || '48'
      if (typeof relativeRange === 'number') {
        this.relativeRangeInMilli = this.getRelativeRangeInMilliseconds(
          parseInt(relativeRange, 10),
          this.relativeUnitOfTime || RelativeUnitOfTime.Hours
        )
      }
    }
    const text = this.getFormattedDate()
    if (text) {
      this.textContent = text
    }
  }

  getRelativeRangeInMilliseconds(range: number, unit: RelativeUnitOfTime) {
    let milliseconds = 1000
    switch (unit) {
      case RelativeUnitOfTime.Months:
        milliseconds *= 30
      case RelativeUnitOfTime.Days:
        milliseconds *= 24
      default:
      case RelativeUnitOfTime.Hours:
        milliseconds *= 60
      case RelativeUnitOfTime.Minutes:
        milliseconds *= 60
      case RelativeUnitOfTime.Seconds:
        milliseconds *= 1
    }
    console.log(range, unit, milliseconds * range)
    return milliseconds * range
  }

  isRelativeTime(): boolean {
    if (!this.date) {
      return false
    }
    const today = new Date()
    const differenceInMilli = this.date.valueOf() - today.valueOf()
    if (this.relativeRangeInMilli) {
      return Math.abs(differenceInMilli) < this.relativeRangeInMilli
    }
    return false
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
    console.log(this.isRelativeTime(), this.date, this.relativeRangeInMilli)
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
