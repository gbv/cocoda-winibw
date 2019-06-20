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
      FIELD: "045Q"
    },
	
    rvk: {
      uri: "http://uri.gbv.de/terminology/rvk",
      namespace: "http://uri.gbv.de/terminology/rvk/",
      FIELD: "045R"
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

  var strNotation = ""
  var auswahlNotation = ""
  var auswahlScheme = ""

  var satz = ""
  var strFeld = ""
  var alleNotationen = new Array()
  var i=0, j=0
  var thePrompter = utility.newPrompter()

  // Anzeigeformat ggf. zu PICA+ wechseln
  if (application.activeWindow.getVariable("P3GPR") != "p"){
    application.activeWindow.command("s p", false)
  }

  // FIXME: scheme erkennen bzw. Auswahl ermöglichen
  auswahlScheme = conceptSchemes.bk

  if (application.activeWindow.materialCode == "Tk"){
    // Normdatensatz
    auswahlNotation = application.activeWindow.findTagContent("045A", 0, false)
    auswahlNotation = feldAnalysePlus(auswahlNotation, "a")
  } else {
    // Titeldatensatz
    satz = __zdbGetExpansionFromP3VTX() // kopiert den Titel incl. Expansionen.
    var zeile = satz.split("\n")
    for (i=0; i < zeile.length; i++){
      strFeld = zeile[i].substr(0,4)
      if (strFeld == auswahlScheme.FIELD) {
        strNotation = feldAnalysePlus(zeile[i], "8")
        var posDollar = strNotation.indexOf("$")
        if (posDollar != -1){
          strNotation = strNotation.substr(0,posDollar)
        }
        alleNotationen[j] = strNotation
        j++
      }
    }
    //alert(alleNotationen.length + "\n" + alleNotationen.join(", "));
    if (alleNotationen.length == 1){
      auswahlNotation = strNotation
    } else if (alleNotationen.length > 1){
      auswahlNotation = thePrompter.select("Liste der Notationen", "Welche Notation wollen Sie in Cocoda anzeigen?", alleNotationen.join("\n"))
      if (!auswahlNotation){
        // Anwender hat keine Auswahl getroffen.
        return
      }
    }
  }

  if (auswahlScheme && auswahlNotation != "") {
    var url = cocodaBase + "?fromScheme=" + encodeURI(auswahlScheme.uri) 
            + "&from=" + encodeURI(auswahlScheme.namespace + auswahlNotation)
    application.shellExecute(url, 5, "open", "")
  }
}