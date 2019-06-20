const assert = require("assert")
const { readFileSync } = require("fs")
const scriptFile = __dirname + "/../k10_cocoda.js"

// set up WinIBW mocking
const { mock, application, utility, __zdbGetExpansionFromP3VTX, feldAnalysePlus } = require("./mock") // eslint-disable-line no-unused-vars

// scriptFile is no ES module wo we need to eval it
eval(readFileSync(scriptFile).toString())

// run tests
describe("CocodaURL", () => {
  it("does not opens Cocoda when no record is given", () => {
    cocodaURL()
    assert.equal(mock.openURL, undefined)
  })

  it("opens Cocoda when record contains one BK field", () => {
    mock.picaRecord = "045Q/00 ƒ812.34"
    cocodaURL()
    assert.equal(mock.openURL, "https://coli-conc.gbv.de/cocoda/app/?fromScheme=http://uri.gbv.de/terminology/bk&from=http://uri.gbv.de/terminology/bk/12.34")
  })
})
