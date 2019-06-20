/**
 * Open Cocoda in the Web browser.
 */
function cocodaURL() // eslint-disable-line no-unused-vars
{
  var cocodaBase = "https://coli-conc.gbv.de/cocoda/app/"

  var conceptSchemes = {
    bk: {
      uri: "http://uri.gbv.de/terminology/bk",
      namespace: "http://uri.gbv.de/terminology/bk/",
      FIELD: "045Q",
      _008A: "kb"
    },
	
    rvk: {
      uri: "http://uri.gbv.de/terminology/rvk",
      namespace: "http://rvk.uni-regensburg.de/nt/",
      FIELD: "045R",
      _008A: "kr"
    },
	
    ddc: {
      uri: "http://dewey.info/scheme/edition/e23",
      namespace: "http://dewey.info/scheme/edition/e23/",
      FIELD: "045F"
    },
	
    gnd: {
      uri: "http://bartoc.org/en/node/430",
      namespace: "http://bartoc.org/en/node/430",
      FIELD: "003U"
    }
  }

  var picaSubfield = function (field, subfield) {
    var pattern = new RegExp("\u0192" + subfield + "([^\u0192\n\r]+)")
    var match = pattern.exec(field)
    if (match) {
      return match[1]
    }
  }

  var picaValue = function (tag, subfield) {
    var field = application.activeWindow.findTagContent(tag, 0, false)
    if (field != undefined) {
      return picaSubfield(field, subfield)
    }
  }

  var auswahlNotation = ""
  var auswahlScheme = ""

  // Anzeigeformat ggf. zu PICA+ wechseln
  if (application.activeWindow.getVariable("P3GPR") != "p"){
    application.activeWindow.command("s p", false)
  }

  // Normdatensatz
  if (application.activeWindow.materialCode == "Tk") {
    var classification = picaValue("008A", "a")
    if (classification) {
      for (scheme in conceptSchemes) {
        scheme = conceptSchemes[scheme]
        if (scheme._008A == classification) {
          auswahlScheme = scheme
          break
        }
      }
      if (auswahlScheme) {
        auswahlNotation = picaValue("045A", "a")
      }
    }
  } 

  // Titeldatensatz
  else {
    // FIXME: Verwendete Normdateien erkennen bzw. Auswahl ermöglichen
    auswahlScheme = conceptSchemes.bk

    var alleNotationen = new Array()
    var record = __zdbGetExpansionFromP3VTX() // kopiert den Titel incl. Expansionen.
    var fields = record.split("\n")    
    for (var i=0; i < fields.length; i++) {
      var tag = fields[i].substr(0,4)
      if (tag == auswahlScheme.FIELD) {
        var notation = picaSubfield(fields[i], "8")
        if (notation != undefined) {
          alleNotationen.push(notation)
        }
      }
    }

    if (alleNotationen.length == 1) {
      auswahlNotation = alleNotationen[0]
    } else if (alleNotationen.length > 1) {
      var thePrompter = utility.newPrompter()
      auswahlNotation = thePrompter.select("Liste der Notationen", "Welche Notation wollen Sie in Cocoda anzeigen?", alleNotationen.join("\n"))
      if (!auswahlNotation) {
        // Anwender hat keine Auswahl getroffen.
        return
      }
    }
  }

  if (auswahlScheme && auswahlNotation != "" && auswahlNotation != undefined) {
    var url = cocodaBase + "?fromScheme=" + encodeURI(auswahlScheme.uri) 
            + "&from=" + encodeURI(auswahlScheme.namespace + encodeURI(auswahlNotation))
    application.shellExecute(url, 5, "open", "")
  }
}
