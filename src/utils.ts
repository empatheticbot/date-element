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
