/**
 * Mockup of WinWIBW environment.
 */

const mock = {
  openURL: undefined,
  picaRecord: "",

  // mocks application.activeWindow.getVariable
  vars: {
    P3VMC: "" // = materialCode
  }
}

const utility = {
  newPrompter: () => {
    (title, question, list) => {
      return list[0]
    }
  }
  // TODO: add alert, input etc. if needed
}

const application = { /* eslint-disable no-unused-vars */ 
  activeWindow: {
    getVariable: (name) => mock.vars[name],
    setVariable: (name,value) => {
      mock.vars[name] = value
    },
    materialCode: "", // TODO: this should always be equal to mock.vars.P3VMC
    command: (command, inNewWindow) => { 

    },
    findTagContent: (tag, occurrence=0, includeTag=true) => {
      // TODO: lookup in mock.picaRecord
    }
  },
  shellExecute: (url, showCommand, operation, parameters) => {
    mock.openURL = url
  }
}

function __zdbGetExpansionFromP3VTX() {
  return mock.picaRecord
}

function feldAnalysePlus(zeile, strFeld){
  /*
	Wird aufgerufen mit einzelnen Zeilen im PicaPlus-Format
	Ermittelt den Inhalt des Unterfeldes
	u192 = ƒ
	*/
  var analyseString = ""
  var lPos1 = zeile.indexOf("\u0192" + strFeld)
  if (lPos1 != -1) {
    analyseString = zeile.substring(lPos1+2)
    var lPos2 = analyseString.indexOf("\u0192") //Beginn des nächsten Unterfeldes
    if (lPos2 != -1){
      analyseString = analyseString.substring(0, lPos2)
    }
  }
  return analyseString
}

module.exports = {
  mock,
  application,
  utility,
  __zdbGetExpansionFromP3VTX,
  feldAnalysePlus,
}
