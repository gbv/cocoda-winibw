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

...

### WinIBW-Skript installieren

...

## Benutzung

...

## Entwicklung

Die WinIBW-Skripte sind in JavaScript geschrieben aber nur zusammen mit einer
K10plus-Installation von WinIBW3 lauffähig. Automatische Tests beschränken sich
deshalb auf statische Code-Analyse:

    npm test        # Überprüft JavaScript-Syntax
    npm run lint    # Statische Code-Analyse und -Formatierung
    npm run fix     # Code-Formatierung anpassen

[![Build Status](https://travis-ci.org/gbv/cocoda-winibw.svg?branch=master)](https://travis-ci.org/gbv/cocoda-winibw)
