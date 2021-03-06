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

Vorausgesetzt werden die WinIBW3 mit K10plus-Skripten und Firefox oder
Chrome-Browser als [Standard-Browser](#standard-browser-festlegen).

### WinIBW-Skript installieren

1. Einmalig in `C:\Program Files (x86)\WinIBW30_K10plus\defaults\pref\setup.js` Folgendes eintragen, damit das Skript beim Neustart von WinWIBW geladen wird:

   `pref("ibw.standardScripts.script.80", "resource:/scripts/k10_cocoda.js");`

  Dabei muss `80` ggf. durch eine andere fortlaufende Nummer ersetzt werden. Alternativ kann diese Zeile auch in eine eigene Datei `C:\Program Files (x86)\WinIBW30_K10plus\defaults\pref\setup_cocoda.js` eingetragen werden um den Eintrag bei Updates von `setup.js` nicht zu verlieren.

2. Das Skript [`k10_cocoda.js`](https://github.com/gbv/cocoda-winibw/raw/master/k10_cocoda.js) herunterladen und nach `C:\Program Files (x86)\WinIBW30_K10plus\scripts\` kopieren. Statt den Download per Hand durchzuführen können auch folgende Kommandos auf der Powershell ausgeführt werden:

    ~~~
    Import-Module bitstransfer
    start-bitstransfer -source https://github.com/gbv/cocoda-winibw/raw/master/k10_cocoda.js -destination "C:\Program Files (x86)\WinIBW30_K10plus\scripts"
    ~~~

3. Um die Scripte neu einzulesen, kann man entweder die WinIBW3 neu starten oder die Tastenkombination SHIFT+STRG+ALT+R verwenden.
Wenn man [Remmina](https://remmina.org/) benutzt, muss man erst die Aktion "Alle Tastatureingaben abfangen" in der Funktionsleiste aktivieren um SHIFT+STRG+ALT+R benutzen zu können.


### Skript einrichten

Cocoda-Funktionen Eintrag in der Funktionsleiste hinzufügen (unter *Optionen* →  *Werkzeugleiste anpassen* →  *Kommandos* →  *Standardfunktionen* per Drag & Drop in das Menu *Normdaten* der Funktionsleiste ziehen:

* `cocodaOpen`
* `cocodaMappings`
* `cocodaShowConcepts`

Zusätzlich können Tastatur-Shortcuts vergeben und die Benennung der Menueinträge (mit Rechtsklick) geändert werden.

![](img/normdaten-menu.png)

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

*Siehe auch die [Anleitung](tutorial.md)*

Folgende Funktionen sind umgesetzt:

* Öffnen von Cocoda aus Normdatensätzen der BK und RVK (`cocodaOpen`)
* Öffnen von Cocoda aus Titeldatensätzen mit BK-, GND- und/oder RVK-Verknüpfungen (`cocodaOpen`)
* Anzeige von Mappings zu genannten Normdatensätzen/Titeldatensätzen (`cocodaMappings`)
* Anzeige von Erkannten Normdaten in einem Datensatz (`cocodaShowConcepts`)

Weitere Funktionen sind geplant (siehe [Issue-Tracker](https://github.com/gbv/cocoda-winibw/issues)).

![](img/open-select-dialog.png)

![](img/show-concepts-dialog.png)

![](img/show-mappings-dialog.png)

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

Änderungen sollten zunächst auf dem `dev` Branch getätigt werden.

[JavaScript 1.4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.4
