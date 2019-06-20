/**
 * Mockup of WinWIBW environment.
 */

const activeWindow = new class {

  constructor() {
    this._vars = { }
    this._setRecord("")
    this.setVariable("P3VMC", "")
  }

  getVariable(name) {
    return this._vars[name] 
  }

  setVariable(name,value) {
    this._vars[name] = value
    if (name === "P3VMC") {
      this.materialCode = value
    }
  }

  command(command) { 
    if (command === "s p") { // Wechsle zur PICA+ Ansicht
      this.setVariable("P3GPR", "p")
    }
  }

  findTagContent(tag, occurrence=0, includeTag=true) { // eslint-disable-line no-unused-vars
    // TODO: support occurrence and includeTag
    var pattern = new RegExp("(^" + tag + ".*)$", "m")
    var match = pattern.exec(this._record)
    if (match) {
      return match[1]
    }
  }

  _setRecord(pica) {
    pica = pica.replace(/\$/g, "\u0192") // ƒ
    var match = pica.match(/^002@ ƒ0(..)/m)
    if (match) {
      this.setVariable("P3VMC", match[1])
    }
    this._record = pica
  }

}() // singleton

const utility = {
  newPrompter: () => {
    return {
      select: (title, question, list) => {
        return list[0]
      }
    }
  }
  // TODO: add alert, input etc. if needed
}

const application = {
  activeWindow,
  shellExecute: (url) => {
    mock.openURL = url
  }
}

const mock = {
  openURL: undefined,
  
  setRecord: (pica) => {
    activeWindow._setRecord(pica)
  }
}

function __zdbGetExpansionFromP3VTX() {
  return activeWindow._record
}

module.exports = {
  mock,
  application,
  utility,
  __zdbGetExpansionFromP3VTX
}
