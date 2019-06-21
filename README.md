# Integration von WinIBW und Cocoda

[![Build Status](https://travis-ci.org/gbv/cocoda-winibw.svg?branch=master)](https://travis-ci.org/gbv/cocoda-winibw)

Dieses Repository enthält Skripte und Anleitungen zur Integration des
Katalogisierungsclient [WinIBW3] mit der Mapping-Anwendung [Cocoda].

*Achtung: Die Integration befindet sich noch im Aufbau und ist nicht für den Produktivbetrieb gedacht!*

[WinIBW3]: https://wiki.k10plus.de/display/K10PLUS/WinIBW-Handbuch
[Cocoda]: https://coli-conc.gbv.de/cocoda/

## Inhalt
- [Installation](#installation)
- [WinIBW-Skript installieren](winibw-skript-installieren)
- [Skript einrichten](skript-einrichten)
- [Standard-Browser festlegen](standard-browser-festlegen)
- [Benutzung](benutzung)
- [Beispieldatensätze in WinIBW](beispieldatensätze-in-winibw)
- [Entwicklung](entwicklung)

## Installation

Voraussgesetzt werden die WinIBW3 mit K10plus-Skripten und Firefox oder
Chrome-Browser als [Standard-Browser](#standard-browser-festlegen).

### WinIBW-Skript installieren

1. Die Skript-Datei `k10_cocoda.js` nach
`C:\Program Files (x86)\WinIBW30_K10plus\scripts\` kopieren

2. In `C:\Program Files (x86)\WinIBW30_K10plus\defaults\pref\setup.js` Folgendes eintragen, damit das Skript beim Neustart von WinWIBW geladen wird:

   `pref("ibw.standardScripts.script.XX", "resource:/scripts/k10_cocoda.js");` wobei `XX` durch eine fortlaufende Nummer ersetzt werden muss.

3. Um die Scripte neu einzulesen, kann man entweder die WinIBW3 neu starten oder die Tastenkombination SHIFT+STRG+ALT+R verwenden.
Wenn man [Remmina](https://remmina.org/) benutzt, muss man erst die Aktion "Alle Tastatureingaben abfangen" in der Funktionsleiste aktivieren um SHIFT+STRG+ALT+R benutzen zu können.

### Skript einrichten

Cocoda-Funktionen als Shortcut und/oder Eintrag in der Funktionsleiste einrichten: 

Optionen -> Werkzeugleiste anpassen -> Kommandos -> Standardfunktionen -> CocodaURL -> Drag&Drop in Funktionsfeld Normdaten

Skript per Funktionsleiste: Normdaten -> cocodaURL für Datensatz ausführen

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

* Öffnen von Cocoda aus Normdatensätzen der BK und RVK
* Öffnen von Cocoda aus Titeldatensätzen mit BK-, GND- und/oder RVK-Verknüpfungen

Weitere Funktionen sind geplant (siehe [Issue-Tracker](https://github.com/gbv/cocoda-winibw/issues)).

## Beispieldatensätze in WinIBW
    
    f ppn 1667549030 # Titeldatensatz mit mehreren BK- und GND-Verknüpfungen
    f ppn 042954150  # Titeldatensatz mit einer BK- und zwei GND-Verknüpfungen
    f ppn 101991983  # BK-Normdatensatz

## Entwicklung

Die WinIBW-Skripte sind in JavaScript geschrieben aber nur zusammen mit einer
K10plus-Installation von WinIBW3 lauffähig. Zum automatischen Testen ist im
Verzeichnis `test` eine rudimentäre WinIBW-Mockup-Umgebung enthalten.
    
    npm install     # Installiert benötigte node-Module
    npm test        # Unit-Tests ausführen
    npm run lint    # Statische Code-Analyse und -Formatierung
    npm run fix     # Code-Formatierung anpassen
