export enum TimeUnit {
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second',
}

export function getSensibleRelativeUnitOfMeasurement(
  date?: Date
): [number, TimeUnit] {
  if (!date) {
    return [0, TimeUnit.Day]
  }
  const signedMilli = date.getTime() - new Date().getTime()

  const ms = Math.abs(signedMilli)
  const sec = ms / 1000
  const min = sec / 60
  const hr = min / 60
  const day = hr / 24
  const month = day / 30
  const year = month / 12

  if (year >= 0.8) {
    return [Math.round(year), TimeUnit.Year]
  } else if (month >= 0.8) {
    return [Math.round(month), TimeUnit.Month]
  } else if (day >= 0.95) {
    return [Math.round(day), TimeUnit.Day]
  } else if (hr >= 1) {
    return [Math.round(hr), TimeUnit.Hour]
  } else if (min >= 0.5) {
    return [Math.round(min), TimeUnit.Minute]
  }
  return [sec, TimeUnit.Second]
}

export function getRelativeRangeInMilliseconds(
  range: number | string,
  unit: TimeUnit
) {
  let relativeRange: number
  if (typeof range === 'string') {
    relativeRange = parseInt(range, 10)
  } else {
    relativeRange = range
  }

  let milliseconds = 1000
  switch (unit) {
    case TimeUnit.Month:
      milliseconds *= 30
    case TimeUnit.Day:
      milliseconds *= 24
    default:
    case TimeUnit.Hour:
      milliseconds *= 60
    case TimeUnit.Minute:
      milliseconds *= 60
    case TimeUnit.Second:
      milliseconds *= 1
  }
  return milliseconds * relativeRange
}
