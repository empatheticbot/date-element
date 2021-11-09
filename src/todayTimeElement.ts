export class TodayTimeElement extends HTMLElement {
  date?: Date

  connectedCallback(): void {
    this.date = new Date()
    this.refreshDisplayTime()
  }

  getFormattedDate(): string {
    if ('Intl' in window && this.date !== undefined) {
      const formatter = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
      return formatter.format(this.date)
    }
    return this.date?.toLocaleString() || ''
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

if (!customElements.get('today-time')) {
  window.TodayTimeElement = TodayTimeElement
  customElements.define('today-time', TodayTimeElement)
}

declare global {
  interface Window {
    TodayTimeElement: typeof TodayTimeElement
  }
  interface HTMLElementTagNameMap {
    'today-time': TodayTimeElement
  }
}
