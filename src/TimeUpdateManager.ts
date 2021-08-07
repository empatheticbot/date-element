import {RelativeTimeElement} from './RelativeTimeElement'

let relativeElements: RelativeTimeElement[] = []
let relativeTimeUpdateInterval: number | undefined

function updateRelativeTimeElements() {
  for (const element of relativeElements) {
    element.refreshDisplayTime()
  }
}

export function registerRelativeTimeElement(el: RelativeTimeElement): void {
  if (relativeElements.includes(el)) {
    return
  }
  relativeElements.push(el)
  if (relativeTimeUpdateInterval === undefined) {
    relativeTimeUpdateInterval = setInterval(updateRelativeTimeElements, 1000)
  }
}

export function unregisterRelativeTimeElement(el: RelativeTimeElement): void {
  relativeElements = relativeElements.filter(element => el !== element)
  if (relativeElements.length === 0) {
    clearInterval(relativeTimeUpdateInterval)
    relativeTimeUpdateInterval = undefined
  }
}
