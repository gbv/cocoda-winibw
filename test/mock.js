/**
 * Mockup of WinWIBW environment.
 */

const mock = {
  openURL: undefined,
  picaRecord: ""
}

const utility = {
  newPrompter: () => {
    (title, question, list) => {
      return list[0]
    }
  }
}

const application = { /* eslint-disable no-unused-vars */ 
  activeWindow: {
    getVariable: (name) => { },  
    command: (command, flag) => { },
    materialCode: "",
    findTagContent: (tag, x, y) => { },
  },
  shellExecute: (url, a, b, c) => {
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
