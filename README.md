# Integration von WinIBW und Cocoda

[![Build Status](https://travis-ci.org/gbv/cocoda-winibw.svg?branch=master)](https://travis-ci.org/gbv/cocoda-winibw)

Dieses Repository enthält Skripte und Anleitungen zur Integration des
Katalogisierungsclient [WinIBW3] mit der Mapping-Anwendung [Cocoda].

*Achtung: Die Integration befindet sich noch im Aufbau und ist nicht für den Produktivbetrieb gedacht!*

[WinIBW3]: https://wiki.k10plus.de/display/K10PLUS/WinIBW-Handbuch
[Cocoda]: https://coli-conc.gbv.de/cocoda/

## Inhalt
- [Installation](#installation)
  - [WinIBW-Skript installieren](#winibw-skript-installieren)
  - [Skript einrichten](#skript-einrichten)
  - [Standard-Browser festlegen](#standard-browser-festlegen)
- [Benutzung](#benutzung)
- [Beispieldatensätze in WinIBW](#beispieldatensätze-in-winibw)
- [Entwicklung](#entwicklung)

## Installation

Voraussgesetzt werden die WinIBW3 mit K10plus-Skripten und Firefox oder
Chrome-Browser als [Standard-Browser](#standard-browser-festlegen).

### WinIBW-Skript installieren

1. Die Skript-Datei [`k10_cocoda.js`](https://github.com/gbv/cocoda-winibw/raw/master/k10_cocoda.js) nach
`C:\Program Files (x86)\WinIBW30_K10plus\scripts\` kopieren

2. In `C:\Program Files (x86)\WinIBW30_K10plus\defaults\pref\setup.js` Folgendes eintragen, damit das Skript beim Neustart von WinWIBW geladen wird:

   `pref("ibw.standardScripts.script.XX", "resource:/scripts/k10_cocoda.js");` wobei `XX` durch eine fortlaufende Nummer ersetzt werden muss.

3. Um die Scripte neu einzulesen, kann man entweder die WinIBW3 neu starten oder die Tastenkombination SHIFT+STRG+ALT+R verwenden.
Wenn man [Remmina](https://remmina.org/) benutzt, muss man erst die Aktion "Alle Tastatureingaben abfangen" in der Funktionsleiste aktivieren um SHIFT+STRG+ALT+R benutzen zu können.

### Skript einrichten

Cocoda-Funktionen als Shortcut und/oder Eintrag in der Funktionsleiste einrichten:

Optionen -> Werkzeugleiste anpassen -> Kommandos -> Standardfunktionen -> `cocodaURL` und `cocodaMappings` -> Drag&Drop in Funktionsfeld Normdaten

Skript per Funktionsleiste: Normdaten -> `cocodaURL` oder `cocodaMappings` für Datensatz ausführen

Zusätzlich kann ein Tastatur-Shortcut vergeben werden.

### Standard-Browser festlegen

Cocoda funktioniert nicht mit dem Internet Explorer. Falls dieser Browser noch
in Windows als Standardbrowser eingerichtet ist, muss stattdessen Chrome oder
Firefox festgelegt werden:

1. Öffnen Sie auf Ihrem Computer das Startmenü
2. Klicken Sie auf Systemsteuerung
3. Klicken Sie auf Programme -> Standardprogramme -> Standardprogramme festlegen
4. Wählen Sie links Chrome/Firefox aus
5. Klicken Sie auf "Dieses Programm als Standard festlegen"
6. Klicken Sie auf OK

## Benutzung

Nach [Einrichtung des Skripts](#skript-einrichten) kann es über die Funktionsleiste aufgerufen werden.

Folgende Funktionen sind umgesetzt:

* Öffnen von Cocoda aus Normdatensätzen der BK und RVK (`cocodaURL`)
* Öffnen von Cocoda aus Titeldatensätzen mit BK-, GND- und/oder RVK-Verknüpfungen (`cocodaURL`)
* Anzeige von Mappings zu genannten Normdatensätzen/Titeldatensätzen (`cocodaMappings`)

Weitere Funktionen sind geplant (siehe [Issue-Tracker](https://github.com/gbv/cocoda-winibw/issues)).

## Beispieldatensätze in WinIBW

    f ppn 1667549030 # Titeldatensatz mit mehreren BK- und GND-Verknüpfungen
    f ppn 042954150  # Titeldatensatz mit einer BK- und zwei GND-Verknüpfungen
    f ppn 101991983  # BK-Normdatensatz

## Entwicklung

Die WinIBW-Skripte sind in [JavaScript 1.4] geschrieben und nur zusammen mit
einer K10plus-Installation von WinIBW3 lauffähig. Zum automatischen Testen ist
im Verzeichnis `test` eine rudimentäre WinIBW-Mockup-Umgebung enthalten.

    npm install     # Installiert benötigte node-Module
    npm test        # Unit-Tests ausführen
    npm run lint    # Statische Code-Analyse und -Formatierung
    npm run fix     # Code-Formatierung anpassen

Da die Tests mit Node statt mit JavaScript 1.4 laufen, wird nicht die
Verwendung neuerer Sprachkonstrukte erkannt, die in WinIBW zu Fehler führen
würden. Insbesondere wird nicht unterstützt:

* `const` und `let` \*
* [Array-Funktionen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.6) (`forEach`, `map`, `filter`, `find`, ...)
* ~~Das [`JSON`-Objekt](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/JSON)~~ wurde über einen Polyfill hinzugefügt.

\*: Dies hat insbesondere Auswirkungen auf den Scope der definierten Variablen. `const` und `let` haben block scope, während `var` function scope hat. Für Details dazu: [You Don't Know JS: Scope & Closures - Chapter 3: Function vs. Block Scope](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md).

[JavaScript 1.4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.4
