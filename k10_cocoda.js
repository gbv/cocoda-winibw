/**
 * Open Cocoda in the Web browser.
 */
function cocodaURL() // eslint-disable-line no-unused-vars
{
  var cocodaBase = "https://coli-conc.gbv.de/cocoda/app/"

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
      },            
    }
  }
  
  // Anzeigeformat ggf. zu PICA+ wechseln
  if (application.activeWindow.getVariable("P3GPR") != "p"){
    application.activeWindow.command("s p", false)
  }

  var selectNotation
  var selectScheme
  var scheme

  // Normdatensatz
  if (application.activeWindow.materialCode == "Tk") {
    var classification = picaValue("008A", "a")
    if (classification) {
      for (scheme in conceptSchemes) {
        scheme = conceptSchemes[scheme]
        if (scheme._008A == classification) {
          selectScheme = scheme
          break
        }
      }
      if (selectScheme) {
        selectNotation = picaValue("045A", "a")
      }
    }
  } 

  // Titeldatensatz
  else {
    var selectConcept
    
    var conceptList = new Array()
    var record = __zdbGetExpansionFromP3VTX() // kopiert den Titel incl. Expansionen.
    var fields = record.split("\n")    
    for (var i=0; i < fields.length; i++) {
      var tag = fields[i].substr(0,4)
      for (var schemeNotation in conceptSchemes) {
        scheme = conceptSchemes[schemeNotation]
        if (tag == scheme.FIELD && scheme.EXTRACT) {
          concept = scheme.EXTRACT(fields[i])
          if (concept) {            
            var conceptLine = schemeNotation + " " + concept.notation
            if (concept.label) {
              conceptLine = conceptLine + " (" + concept.label + ")"
            }
            conceptList.push(conceptLine)            
          }
        }
      }
    }

    if (conceptList.length == 1) {
      selectConcept = conceptList[0]
    } else if (conceptList.length > 1) {
      var thePrompter = utility.newPrompter()
      selectConcept = thePrompter.select("Liste der Notationen", "Welche Notation wollen Sie in Cocoda anzeigen?", conceptList.join("\n"))
    }
    
    if (selectConcept) {
      var match = selectConcept.match(/([^ ]+) (.+?)( \(.+\))?$/)        
      selectScheme = conceptSchemes[match[1]]
      selectNotation = match[2]
    }          
  }
      
  // Cocoda im Browser öffnen
  if (selectScheme && selectNotation != undefined) {
    var url = cocodaBase + "?fromScheme=" + encodeURIComponent(selectScheme.uri) 
            + "&from=" + encodeURIComponent(selectScheme.namespace + encodeURI(selectNotation))
    application.shellExecute(url, 5, "open", "")
  }
}
