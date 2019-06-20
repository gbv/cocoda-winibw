//Datei:	k10_scripting_tests.js

function cocodaURL()
{
	//Cocoda
	var strNotation = ""
	var auswahlNotation = "";
	var satz = "";
	var strFeld = "";
	var oRegExpFeld = /045[FQR]/;
	var alleNotationen = new Array();
	var i=0, j=0;
	var thePrompter = utility.newPrompter();
	var cocoda_url = "https://coli-conc.gbv.de/cocoda/app/?fromScheme=http%3A%2F%2Furi.gbv.de%2Fterminology%2Fbk%2F&from=http%3A%2F%2Furi.gbv.de%2Fterminology%2Fbk%2";
	//Anzeigeformat Pica+:
	if (application.activeWindow.getVariable("P3GPR") != "p"){
		application.activeWindow.command("s p", false);
	}
	if (application.activeWindow.materialCode == "Tk"){
		//Im Normsatz gibt es nur 1 Notation.
		auswahlNotation = application.activeWindow.findTagContent("045A", 0, false);
		auswahlNotation = feldAnalysePlus(auswahlNotation, "a");
		//alert(auswahlNotation);
	} else {
		satz = __zdbGetExpansionFromP3VTX();//kopiert den Titel incl. Expansionen.
		var zeile = satz.split("\n");
		for (i=0; i < zeile.length; i++){
			strFeld = zeile[i].substr(0,4);
			if (oRegExpFeld.test(strFeld)) {
				strNotation = feldAnalysePlus(zeile[i], "8");
				var posDollar = strNotation.indexOf("$");
				if (posDollar != -1){
					strNotation = strNotation.substr(0,posDollar);
				}
				alleNotationen[j] = strNotation;
				j++;
			}
		}
		//alert(alleNotationen.length + "\n" + alleNotationen.join(", "));
		if(alleNotationen.length == 1){
			auswahlNotation = strNotation;
		} else if(alleNotationen.length > 1){
			auswahlNotation = thePrompter.select("Liste der Notationen", "Welche Notation wollen Sie in Cocoda anzeigen?", alleNotationen.join("\n"));
			if (!auswahlNotation){
				//Anwender hat keine Auswahl getroffen.
				return;
			}
		}
	}
	//alert(auswahlNotation);
	if (auswahlNotation != ""){
		application.shellExecute(cocoda_url + auswahlNotation, 5, "open", "");
	}
}
