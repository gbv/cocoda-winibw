# Integration von WinIBW und Cocoda

Dieses Repository enthält Skripte und Anleitungen zur Integration des Katalogisierungsclient [WinIBW3] mit der Mapping-Anwendung [Cocoda].

*Achtung: Die Integration befindet sich noch im Aufbau und ist nicht für den Produktivbetrieb gedacht!*

[WinIBW3]: https://wiki.k10plus.de/display/K10PLUS/WinIBW-Handbuch
[Cocoda]: https://coli-conc.gbv.de/cocoda/

## Funktionen

Zunächst wird nur eine Funktion umgesetzt:

* Öffnen von Cocoda mit ausgewählten Normdatensätzen aus WinIBW heraus

Weitere Funktionen sind geplant (siehe [Issue-Tracker](https://github.com/gbv/cocoda-winibw/issues)).

## Voraussetzungen

* WinIBW3 mit K10plus-Skripten
* Firefox oder Chrome-Browser als [Standard-Browser](#standard-browser-festlegen)

## Installation


### Standard-Browser festlegen

Cocoda funktioniert nicht mit dem Internet Explorer. Falls dieser Browser noch in Windows als Standardbrowser eingerichtet ist, muss stattdessen Chrome oder Firefox festgelegt werden.

1. Öffnen Sie auf Ihrem Computer das Startmenü .
2. Klicken Sie auf Systemsteuerung.
3. Klicken Sie auf Programme -> Standardprogramme -> Standardprogramme festlegen.
4. Wählen Sie links Chrome/Firefox aus.
5. Klicken Sie auf "Dieses Programm als Standard festlegen".
6. Klicken Sie auf OK.

### WinIBW-Skript installieren

1. Die Skript-Datei `k10_cocoda.js` nach
`C:\Program Files (x86)\WinIBW30_K10plus\scripts\` kopieren

2. In `C:\Program Files (x86)\WinIBW30_K10plus\defaults\pref\setup.js` Folgendes eintragen, damit das Skript beim Neustart von WinWIBW geladen wird:

   `pref("ibw.standardScripts.script.XX", "resource:/scripts/k10_cocoda.js");` wobei `XX` durch eine fortlaufende Nummer ersetzt werden muss.

3. Um die Scripte neu einzulesen, kann man entweder die WinIBW3 neu starten (oder die Tastenkombination SHIFT+STRG+ALT+R verwenden).



## Benutzung

Cocoda-Funktionen als Shortcut und/oder Eintrag in der Funktionsleiste einrichten: 

Optionen -> Werkzeugleiste anpassen -> Kommandos -> Standardfunktionen -> CocodaURL -> Drag&Drop in Funktionsfeld Katalogisierung

Skript per Funktionsleiste: Katalogisierung -> cocodaURL für Datensatz ausführen

## Beispieldatensätze in WinIBW
    
    f ppn 1667549030 #2 Datensätze, Auswahlbox
    f ppn 042954150 #1 Datensatz
    f ppn 101991983 #BK-Normdatensatz

## Entwicklung

Die WinIBW-Skripte sind in JavaScript geschrieben aber nur zusammen mit einer
K10plus-Installation von WinIBW3 lauffähig. Automatische Tests beschränken sich
deshalb auf statische Code-Analyse:
    
    npm install     # Installiert benötigte node-Module
    npm test        # Überprüft JavaScript-Syntax
    npm run lint    # Statische Code-Analyse und -Formatierung
    npm run fix     # Code-Formatierung anpassen

[![Build Status](https://travis-ci.org/gbv/cocoda-winibw.svg?branch=master)](https://travis-ci.org/gbv/cocoda-winibw)
