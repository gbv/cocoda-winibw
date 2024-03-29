// Configuration
var cocodaBase = "https://coli-conc.gbv.de/cocoda/app/"
var cocodaApiBase = "https://coli-conc.gbv.de/api/"
var cocodaOpenAlwaysShowChoice = false
var cocodaMsg = {
  coliConcFunctionsTitle: "coli-conc Funktionen",
  coliConcFunctionsText: "Die coli-conc Integration bietet folgende Funktionen:",
  missingConceptsTitle: "Keine Normdaten gefunden",
  missingConcepts: "Im aktuellen Datensatz konnten keine Normdaten gefunden werden!",
  listConceptsTitle: "Im aktuellen Datensatz gefundene Normdaten",
  listMappingsTitle: "Passende Mappings",
  listMappings: "Folgende passenden Mappings sind in Cocoda vorhanden",
  missingMappingsTitle: "Keine Normdaten-Mappings gefunden",
  missingMappings: "In Cocoda konnten keine passenden Normdaten-Mappings gefunden werden",
  openTitle: "Cocoda öffnen",
  openSelectConcept: "Mit welchem Normdatensatz soll Cocoda geöffnet werden?"
}

// Polyfills (JSON, Array.find, Array.map)
// See also: https://github.com/gbv/cocoda-winibw/wiki/JavaScript-Polyfills
if(!JSON)var JSON={parse:function(sJSON){return eval("("+sJSON+")")},stringify:function(){function i(r){return t[r]||"\\u"+(r.charCodeAt(0)+65536).toString(16).substr(1)}var f=Object.prototype.toString,a=Array.isArray||function(r){return"[object Array]"===f.call(r)},t={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"},c=/[\\"\u0000-\u001F\u2028\u2029]/g;return function r(t){if(null==t)return"null";if("number"==typeof t)return isFinite(t)?t.toString():"null";if("boolean"==typeof t)return t.toString();if("object"==typeof t){if("function"==typeof t.toJSON)return r(t.toJSON());if(a(t)){for(var n="[",e=0;e<t.length;e++)n+=(e?", ":"")+r(t[e]);return n+"]"}if("[object Object]"===f.call(t)){var o=[];for(var u in t)t.hasOwnProperty(u)&&o.push(r(u)+": "+r(t[u]));return"{"+o.join(", ")+"}"}}return'"'+t.toString().replace(c,i)+'"'}}()}; // eslint-disable-line
Array.prototype.find = Array.prototype.find || function (r) { if ("function" != typeof r) throw new TypeError("callback must be a function"); for (var t = Object(this), n = arguments[1], o = 0; o < t.length; o++) { var e = t[o]; if (r.call(n, e, o, t)) return e } }
Array.prototype.map || (Array.prototype.map = function (r) { var t, n, o; if (null == this) throw new TypeError("this is null or not defined"); var e = Object(this), i = e.length >>> 0; if ("function" != typeof r) throw new TypeError(r + " is not a function"); for (1 < arguments.length && (t = arguments[1]), n = new Array(i), o = 0; o < i;) { var a, p; o in e && (a = e[o], p = r.call(t, a, o, e), n[o] = p), o++ } return n })

// Labels for mapping types
var mappingTypes = {
  "http://www.w3.org/2004/02/skos/core#exactMatch": "exakte Übereinstimmung",
  "http://www.w3.org/2004/02/skos/core#closeMatch": "hohe Übereinstimmung",
  "http://www.w3.org/2004/02/skos/core#broadMatch": "allgemeinere Bedeutung",
  "http://www.w3.org/2004/02/skos/core#narrowMatch": "spezifischere Bedeutung",
  "http://www.w3.org/2004/02/skos/core#relatedMatch": "verwandte Bedeutung"
}

/**
 * Offers a selection of available coli-conc functions.
 */
// eslint-disable-next-line no-unused-vars
function coli_conc() {
  var prompter = utility.newPrompter()
  var functions = [
    {
      title: cocodaMsg.openTitle,
      fn: cocodaOpen
    },
    {
      title: cocodaMsg.listConceptsTitle,
      fn: cocodaShowConcepts
    },
    {
      title: cocodaMsg.listMappingsTitle,
      fn: cocodaMappings
    }
  ]
  var reply = prompter.select(cocodaMsg.coliConcFunctionsTitle, cocodaMsg.coliConcFunctionsText, functions.map(function (f) { return f.title }).join("\n"))
  if (reply) {
    var result = functions.find(function (f) {
      return f.title === reply
    })
    if (result) {
      result.fn()
    }
  }
}

function __cocodaConceptLine(concept, scheme) {
  var line = concept.notation[0]
  if (scheme) {
    line = scheme.notation[0] + " " + line
  }
  if (concept.label) {
    line += " (" + concept.label + ")"
  }
  return line
}

/**
 * Shows a message box with the list of available concepts.
 */
// eslint-disable-next-line no-unused-vars
function cocodaShowConcepts() {
  var result = __cocodaGetConcepts()
  var text = ""
  for (var i = 0; i < result.length; i += 1) {
    text += __cocodaConceptLine(result[i].concept, result[i].scheme) + "\n"
  }
  if (text == "") {
    application.messageBox(cocodaMsg.missingConceptsTitle, cocodaMsg.missingConcepts, "alert-icon")
  } else {
    application.messageBox(cocodaMsg.listConceptsTitle, text, "message-icon")
  }
}

/**
 * Opens Cocoda in the web browser.
 *
 * If there are no concepts found in the dataset, an alert will be shown.
 * If there are more than one concept found in the dataset, a prompt will be shown to select one of the concepts.
 */
// eslint-disable-next-line no-unused-vars
function cocodaOpen() {
  var result = __cocodaGetConcepts()
  var selectScheme
  var selectConcept

  if (result.length == 0) {
    application.messageBox(cocodaMsg.missingConceptsTitle, cocodaMsg.missingConcepts, "alert-icon")
    return
  } else if (result.length == 1 && !cocodaOpenAlwaysShowChoice) {
    selectScheme = result[0].scheme
    selectConcept = result[0].concept
  } else if (result.length > 1) {
    var thePrompter = utility.newPrompter()
    var conceptList = []
    for (var i = 0; i < result.length; i += 1) {
      conceptList.push(__cocodaConceptLine(result[i].concept, result[i].scheme))
    }
    var reply = thePrompter.select(cocodaMsg.openTitle, cocodaMsg.openSelectConcept, conceptList.join("\n"))
    if (reply) {
      var match = reply.match(/([^ ]+) (.+?)( \(.+\))?$/)
      // Find match in result list
      // TODO: - Maybe polyfill Array.find()
      for (var j = 0; j < result.length; j += 1) {
        if (result[j].scheme.notation == match[1] && result[j].concept.notation == match[2]) {
          selectScheme = result[j].scheme
          selectConcept = result[j].concept
        }
      }
    }
  }

  // Cocoda im Browser öffnen
  if (selectScheme && selectConcept) {
    var url = cocodaBase + "?fromScheme=" + encodeURIComponent(selectScheme.uri)
            + "&from=" + encodeURIComponent(selectConcept.uri)
    application.shellExecute(url, "open", "")
  }
}

/**
 * Queries all mappings related to the current dataset.
 */
// eslint-disable-next-line no-unused-vars
function cocodaMappings() {
  var results = __cocodaGetConcepts()
  if (results.length == 0) {
    application.messageBox(cocodaMsg.missingConceptsTitle, cocodaMsg.missingConcepts, "alert-icon")
    return
  }

  var mappings, message

  // Request mappings from API
  var url = cocodaApiBase + "mappings?"
  var conceptUris = []
  for (var i = 0; i < results.length; i += 1) {
    conceptUris.push(encodeURIComponent(results[i].concept.uri))
  }
  url += "from=" + conceptUris.join("|") + "&direction=both"
  try {
    mappings = __cocodaHttpRequest(url)
  } catch(error) {
    mappings = []
    message = "Fehler bei der API-Abfrage: " + error.message
  }
  if (!mappings.length) {
    application.messageBox(cocodaMsg.missingMappingsTitle, message || cocodaMsg.missingMappings, "alert-icon")
    return
  }

  var mappingList = []

  // Transform mappings into text form
  for (var j = 0; j < mappings.length; j += 1) {
    var text = ""
    var mapping = mappings[j]
    // Assuming there is always fromScheme/from with notations
    text += __cocodaConceptLine(mapping.from.memberSet[0], mapping.fromScheme)
    // TODO: Integrate mapping types
    text += " --> "
    if (mapping.toScheme && mapping.toScheme.notation) {
      text += mapping.toScheme.notation[0].toUpperCase() + " "
    }
    var toConcepts = mapping.to.memberSet || mapping.to.memberChoice
    var toConceptNotations = []
    for (var k = 0; k < toConcepts.length; k += 1) {
      if (toConcepts[k].notation) {
        toConceptNotations.push(toConcepts[k].notation[0])
      }
    }
    text += toConceptNotations.join(" & ")
    var creator = (mapping.creator && mapping.creator[0] && mapping.creator[0].prefLabel && (mapping.creator[0].prefLabel.de || mapping.creator[0].prefLabel.en)) || "unbekannt"
    text += " [von " + creator
    var typeLabel = mappingTypes[mapping.type && mapping.type[0]]
    if (typeLabel) {
      text += ", " + typeLabel
    }
    if (mapping.created) {
      text += ", " + mapping.created.slice(0, 10)
    }
    text += "]"
    mappingList.push(text)
  }

  var thePrompter = utility.newPrompter()
  thePrompter.select(cocodaMsg.listMappingsTitle, cocodaMsg.listMappings, mappingList.join("\n"))
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
      uri: "http://uri.gbv.de/terminology/bk/",
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
      uri: "http://uri.gbv.de/terminology/rvk/",
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
        } else {
          var notation = picaSubfield(field, "a")
          if (notation) {
            return {
              notation: notation
            }
          }
        }
      },
      _008A: "kr"
    },

    DDC: {
      uri: "http://dewey.info/scheme/edition/e23/",
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
      for (var conceptScheme in conceptSchemes) {
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
        scheme.notation = [schemeNotation]
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

  for (var j = 0; j < result.length; j += 1) {
    // Add concept URIs to result
    result[j].concept.uri = result[j].scheme.namespace + encodeURIComponent(result[j].concept.notation)
    // Notation as array
    result[j].concept.notation = [result[j].concept.notation]
  }

  return result

}

/**
 * Performs a HTTP request and returns the result as an array or object.
 *
 * @param {string} url
 * @param {string} method `GET` (default), `POST`, etc.
 * @param {*} data
 */
function __cocodaHttpRequest(url, method, data) {
  method = method || "GET"
  data = data || null
  var request = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0")
  request.open(method, url, false) // third argument `false` => synchronous request
  request.send(data)
  if (request.readyState == 4 && request.status == 200) {
    return JSON.parse(request.responseText)
  } else {
    throw Error("Request not successful (code " + request.status + ")")
  }
}
