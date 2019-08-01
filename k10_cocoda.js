var cocodaBase = "https://coli-conc.gbv.de/cocoda/app/"
var cocodaURLAlwaysShowChoice = false

/**
 * Opens Cocoda in the web browser.
 *
 * If there are no concepts found in the dataset, an alert will be shown.
 * If there are more than one concept found in the dataset, a prompt will be shown to select one of the concepts.
 */
function cocodaURL() { // eslint-disable-line no-unused-vars
  var result = __cocodaGetConcepts()
  var selectScheme
  var selectConcept

  if (result.length == 0) {
    application.messageBox("Keine Konzepte gefunden", "Es konnten im aktuellen Datensatz keine Konzepte gefunden werden.", "alert-icon")
    return
  } else if (result.length == 1 && !cocodaURLAlwaysShowChoice) {
    selectScheme = result[0].scheme
    selectConcept = result[0].concept
  } else if (result.length > 1) {
    var thePrompter = utility.newPrompter()
    var conceptList = []
    for (i = 0; i < result.length; i += 1) {
      var concept = result[i].concept
      var scheme = result[i].scheme
      var conceptLine = scheme.notation + " " + concept.notation
      if (concept.label) {
        conceptLine = conceptLine + " (" + concept.label + ")"
      }
      conceptList.push(conceptLine)
    }
    var reply = thePrompter.select("Liste der Notationen", "Welche Notation wollen Sie in Cocoda anzeigen?", conceptList.join("\n"))
    if (reply) {
      var match = reply.match(/([^ ]+) (.+?)( \(.+\))?$/)
      // Find match in result list
      // TODO: - Maybe polyfill Array.find()
      for (i = 0; i < result.length; i += 1) {
        if (result[i].scheme.notation == match[1] && result[i].concept.notation == match[2]) {
          selectScheme = result[i].scheme
          selectConcept = result[i].concept
        }
      }
    }
  }

  // Cocoda im Browser öffnen
  if (selectScheme && selectConcept) {
    var url = cocodaBase + "?fromScheme=" + encodeURIComponent(selectScheme.uri)
            + "&from=" + encodeURIComponent(selectConcept.uri)
    application.shellExecute(url, 5, "open", "")
  }
}

/**
 * Shows a message box with the list of available concepts.
 */
function cocodaShowConcepts() { // eslint-disable-line no-unused-vars
  var result = __cocodaGetConcepts()
  var text = ""
  for (var i = 0; i < result.length; i += 1) {
    text += result[i].scheme.notation + " - " + result[i].concept.notation
    if (result[i].concept.label) {
      text += " (" + result[i].concept.label + ")"
    }
    text += "\n"
  }
  var icon = "message-icon"
  if (text == "") {
    icon = "alert-icon"
    text = "Keine Konzepte gefunden."
  }
  application.messageBox("Gefundene Konzepte", text, icon)
}

/**
 * Returns a list of concepts found in the current dataset.
 *
 * The return value is an array of objects in the following form:
 * {
 *   scheme: { uri: ..., notation: ..., ... },
 *   concept: { uri: ..., notation: ..., label: ... }
 * }
 * concept.label might or might not be available.
 */
function __cocodaGetConcepts() {

  var picaSubfield = function (field, subfield) {
    var pattern = new RegExp("[\u0192$]" + subfield + "([^$\u0192\n\r]+)")
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

  var conceptSchemes = {
    BK: {
      uri: "http://uri.gbv.de/terminology/bk",
      namespace: "http://uri.gbv.de/terminology/bk/",
      FIELD: "045Q",
      EXTRACT: function(field) {
        var notation = picaSubfield(field, "8")
        if (notation) {
          return {
            notation: notation,
            label: picaSubfield(field, "j")
          }
        }
      },
      _008A: "kb"
    },

    RVK: {
      uri: "http://uri.gbv.de/terminology/rvk",
      namespace: "http://rvk.uni-regensburg.de/nt/",
      FIELD: "045R",
      EXTRACT: function(field) {
        var expanded = picaSubfield(field, "8")
        if (expanded) {
          var match = expanded.match(/([^:]+)(: (.+))?/)
          if (match) {
            return {
              notation: match[1],
              label: match[3]
            }
          }
        }
      },
      _008A: "kr"
    },

    DDC: {
      uri: "http://dewey.info/scheme/edition/e23",
      namespace: "http://dewey.info/scheme/edition/e23/",
      FIELD: "045F"
    },

    GND: {
      uri: "http://bartoc.org/en/node/430",
      namespace: "http://d-nb.info/gnd/",
      FIELD: "041A",
      EXTRACT: function(field) {
        var expanded = picaSubfield(field, "8")
        if (expanded) {
          var match = expanded.match(/(.+) ; ID: gnd\/(.+)/)
          if (match) {
            return {
              notation: match[2],
              label: match[1]
            }
          }
        }
      }
    }
  }

  // Anzeigeformat ggf. zu PICA+ wechseln
  if (application.activeWindow.getVariable("P3GPR") != "p"){
    application.activeWindow.command("s p", false)
  }

  var scheme
  var concept
  var result

  // Normdatensatz
  if (application.activeWindow.materialCode == "Tk") {
    var classification = picaValue("008A", "a")
    if (classification) {
      for (conceptScheme in conceptSchemes) {
        conceptScheme = conceptSchemes[conceptScheme]
        if (conceptScheme._008A == classification) {
          scheme = conceptScheme
          break
        }
      }
      if (scheme) {
        concept = {
          notation: picaValue("045A", "a")
        }
      }
    }
    if (scheme && concept) {
      result = [{
        scheme: scheme,
        concept: concept
      }]
    } else {
      result = []
    }
  }
  // Titeldatensatz
  else {

    result = new Array()
    var record = __zdbGetExpansionFromP3VTX() // kopiert den Titel incl. Expansionen.
    var fields = record.split("\n")
    for (var i=0; i < fields.length; i++) {
      var tag = fields[i].substr(0,4)
      for (var schemeNotation in conceptSchemes) {
        scheme = conceptSchemes[schemeNotation]
        scheme.notation = schemeNotation
        if (tag == scheme.FIELD && scheme.EXTRACT) {
          concept = scheme.EXTRACT(fields[i])
          if (concept) {
            result.push({
              scheme: scheme,
              concept: concept
            })
          }
        }
      }
    }
  }

  // Add concept URIs to result
  for (i = 0; i < result.length; i += 1) {
    result[i].concept.uri = result[i].scheme.namespace + encodeURIComponent(result[i].concept.notation)
  }

  return result

}
