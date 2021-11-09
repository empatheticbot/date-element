let timeElements: TimeElement[] = []
let timeUpdateInterval: number | undefined

interface TimeElement {
  refreshDisplayTime(): void
}

function updateRelativeTimeElements() {
  for (const element of timeElements) {
    element.refreshDisplayTime()
  }
}

export function registerRelativeTimeElement(el: TimeElement): void {
  if (timeElements.includes(el)) {
    return
  }
  timeElements.push(el)
  if (timeUpdateInterval === undefined) {
    timeUpdateInterval = setInterval(updateRelativeTimeElements, 1000)
  }
}

export function unregisterRelativeTimeElement(el: TimeElement): void {
  timeElements = timeElements.filter((element) => el !== element)
  if (timeElements.length === 0) {
    clearInterval(timeUpdateInterval)
    timeUpdateInterval = undefined
  }
}
