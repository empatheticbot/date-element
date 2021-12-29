# date-elements

Custom elements to express dates in relative format and be updated dynamically.

## Installation

```bash
$ npm install --save @empatheticbot/date-elements
```

## Import

**Import as ES module:**

```javascript
import '@empatheticbot/date-elements'
```

**With a script tag:**

```html
<script type="module" src="./node_modules/@empatheticbot/date-elements/dist/index.js">
```

_Note that the path is relative to the root of your project, this may not be the case in your application, so check to make sure your path is correct and the module is being served._

## relative-date

Used to always express a date relative to now (ex: _four hours ago_, _in 3 days_). Currently, the resolution is fixed and will pick the largest unit of time that can express the resolution in a whole integer. Meaning, _.5 minutes_ would never be used, it'd be _30 seconds_.

### Usage

```html
<relative-date datetime="{ISO Date String}">
  {Fallback text date}
</relative-date>
```

**Basic Example:**

```html
<relative-date datetime="2021-12-29T18:40:52.583Z"> 12/29/2021 </relative-date>
```

While it's not required, I recommend adding a date to the element text so users on older browsers that don't support custom elements still see the absolute date, even if the relative date fails.

**With Relative Range:**

Occasionally you'll want to switch between relative and absolute dates given a range (for instance, when something is months away, sometimes a precise date is more useful than _in 3 months_). This can be achieved using the attributes `relative-range` and `relative-unit`. For instance, the following will show the date as relative if it is within 2 days of the current date:

```html
<relative-date
  relative-range="2"
  relative-unit="day"
  datetime="2021-12-29T18:40:52.583Z"
>
  12/29/2021
</relative-date>
```

### Attributes

- **`title`** will be set by the element and will be a long formatted date. This makes the date a little more accessible by offering the absolute date for those that seek it.
- **`datetime (required)`** is an [ISO datetime string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) representing the date we want to measure from the current date.
- **`relative-range (optional)`** is the range at which the element will continue to show the relative date over the absolute. Defaults to `Infinity`.
- **`relative-unit (optional)`** is the unit of time `relative-range` units refer to (`year|month|day|hour|minute|second`). The default is `hour`.

## until-date

This behaves exactly like `relative-date` for any date that is in the future. The difference is that once the date has passed, it will clamp to the text _now_. This is useful for things such as countdowns.

### Usage

```html
<until-date datetime="{ISO Date String}"> {Fallback text date} </until-date>
```

**Example:**

```html
<until-date datetime="2024-12-29T18:40:52.583Z"> 12/29/2024 </until-date>
```

### Attributes

- **`title`** will be set by the element and will be a long formatted date. This makes the date a little more accessible by offering the absolute date for those that seek it.
- **`datetime (required)`** is an [ISO datetime string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) representing the date we want to measure from the current date.

## since-date

This behaves opposite to `until-date`. If the date is in the future, or within the last 2 minutes, it will read _now_. Otherwise, it will give the relative time since the date occurred.

### Usage

```html
<since-date datetime="{ISO Date String}"> {Fallback text date} </since-date>
```

**Example:**

```html
<since-date datetime="2019-12-29T18:40:52.583Z"> 12/29/2019 </since-date>
```

### Attributes

- **`title`** will be set by the element and will be a long formatted date. This makes the date a little more accessible by offering the absolute date for those that seek it.
- **`datetime (required)`** is an [ISO datetime string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) representing the date we want to measure from the current date.

## Development

To install dependencies and build the custom element:

```
npm install
npm run build
```

The resulting built custom element can be found in the `dist` directory. From here you can start a simple HTTP server with `npm run start` and navigate to http://localhost:3000/examples/. Note that if you make changes to source you will need to run `npm run build` again and refresh the page.

Tests should be written and live next to the source code it tests. The file name should match that of what it tests with an extension of `.test.ts`. Tests can be ran with `npm run test`.

## Notes

- Special thanks to [Github Custom Element Boilerplate](https://github.com/github/custom-element-boilerplate) project for a lot of inspiration with this template. In fact, they have [time-elements](https://github.com/github/time-elements) that are a lot more feature rich than what you'll find here.
