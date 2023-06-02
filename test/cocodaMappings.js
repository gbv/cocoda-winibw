const assert = require("assert")
const { readFileSync } = require("fs")
const querystring = require("querystring")
const scriptFile = __dirname + "/../scripts/k10_cocoda.js"

// set up WinIBW mocking
const { mock, application, Components, utility, __zdbGetExpansionFromP3VTX, feldAnalysePlus } = require("./mock")() // eslint-disable-line no-unused-vars

// scriptFile is no ES module wo we need to eval it
eval(readFileSync(scriptFile).toString())

function expectURL(query) {
  assert.equal(mock.apiURL, "http://coli-conc.gbv.de/api/mappings?" + querystring.stringify(query))
}

// run tests
describe("cocodaMappings", () => {
  it("no record", () => {
    cocodaMappings()
    assert.equal(mock.apiURL, undefined)
  })

  it("record contains one BK field", () => {
    mock.setRecord("045Q/00 $812.34")
    cocodaMappings()
    expectURL({from:"http://uri.gbv.de/terminology/bk/12.34", direction: "both"})
  })

  it("is BK record", () => {
    mock.setRecord("002@ $0Tkv\n008A $akb\n045A $a08.15")
    cocodaMappings()
    expectURL({from:"http://uri.gbv.de/terminology/bk/08.15", direction: "both"})
  })

  it("is RVK record", () => {
    mock.setRecord("002@ $0Tkv\n008A $akr\n045A $aNZ 14420")
    cocodaMappings()
    expectURL({from:"http://rvk.uni-regensburg.de/nt/NZ%2014420", direction: "both"})
  })

})
