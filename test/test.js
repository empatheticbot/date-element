/* eslint-disable github/no-inner-html */
const delay = async (number) => {
  return new Promise((reslove) => {
    setTimeout(() => reslove(), number)
  })
}

describe('today-date element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('today-date')
      assert.equal('TODAY-DATE', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.TodayDateElement()
      assert.equal('TODAY-DATE', el.nodeName)
    })
  })

  describe('date formatting', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <today-date></today-date>
        </div>
      `
    })
  })
})

describe('awesome-date element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('awesome-date')
      assert.equal('AWESOME-DATE', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.AwesomeDateElement()
      assert.equal('AWESOME-DATE', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <awesome-date></awesome-date>
        </div>
      `
    })
  })
})

describe('relative-date element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('relative-date')
      assert.equal('RELATIVE-DATE', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.RelativeDateElement()
      assert.equal('RELATIVE-DATE', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <relative-date></relative-date>
        </div>
      `
    })
  })
})

describe('since-date element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('since-date')
      assert.equal('SINCE-DATE', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.SinceDateElement()
      assert.equal('SINCE-DATE', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <since-date></since-date>
        </div>
      `
    })
  })
})

describe('until-date element', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('until-date')
      assert.equal('UNTIL-DATE', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.UntilDateElement()
      assert.equal('UNTIL-DATE', el.nodeName)
    })
  })

  describe('renders', function () {
    beforeEach(function () {
      document.body.innerHTML = `
        <div id="mocha-fixture">
          <until-date></until-date>
        </div>
      `
    })
  })
})
