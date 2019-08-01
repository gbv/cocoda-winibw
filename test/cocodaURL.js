const assert = require("assert")
const { readFileSync } = require("fs")
const querystring = require("querystring")
const scriptFile = __dirname + "/../k10_cocoda.js"

// set up WinIBW mocking
const { mock, application, utility, __zdbGetExpansionFromP3VTX, feldAnalysePlus } = require("./mock")() // eslint-disable-line no-unused-vars

// scriptFile is no ES module wo we need to eval it
eval(readFileSync(scriptFile).toString())

function expectURL(query) {
  assert.equal(mock.openURL, "https://coli-conc.gbv.de/cocoda/app/?" + querystring.stringify(query))
}

// run tests
describe("CocodaURL", () => {
  it("does not opens Cocoda when no record is given", () => {
    cocodaURL()
    assert.equal(mock.openURL, undefined)
  })

  it("opens Cocoda when record contains one BK field", () => {
    mock.setRecord("045Q/00 $812.34")
    cocodaURL()
    expectURL({fromScheme:"http://uri.gbv.de/terminology/bk",from:"http://uri.gbv.de/terminology/bk/12.34"})
  })

  it("opens Cocoda from BK record", () => {
    mock.setRecord("002@ $0Tkv\n008A $akb\n045A $a08.15")
    cocodaURL()
    expectURL({fromScheme:"http://uri.gbv.de/terminology/bk",from:"http://uri.gbv.de/terminology/bk/08.15"})
  })

  it("opens Cocoda from RVK record", () => {
    mock.setRecord("002@ $0Tkv\n008A $akr\n045A $aNZ 14420")
    cocodaURL()
    expectURL({fromScheme:"http://uri.gbv.de/terminology/rvk",from:"http://rvk.uni-regensburg.de/nt/NZ%2014420"})
  })

})
