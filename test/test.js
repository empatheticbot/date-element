/* eslint-disable github/no-inner-html */
const delay = async (number) => {
  return new Promise((reslove) => {
    setTimeout(() => reslove(), number)
  })
}

describe('today-time element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('today-time')
      assert.equal('TODAY-TIME', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.TodayTimeElement()
      assert.equal('TODAY-TIME', el.nodeName)
    })
  })

  describe('date formatting', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <today-time></today-time>
        </div>
      `
    })
  })
})

describe('awesome-time element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('awesome-time')
      assert.equal('AWESOME-TIME', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.AwesomeTimeElement()
      assert.equal('AWESOME-TIME', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <awesome-time></awesome-time>
        </div>
      `
    })
  })
})

describe('relative-time element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('relative-time')
      assert.equal('RELATIVE-TIME', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.RelativeTimeElement()
      assert.equal('RELATIVE-TIME', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <relative-time></relative-time>
        </div>
      `
    })
  })
})
