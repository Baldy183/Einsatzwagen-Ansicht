// ==UserScript==
// @name        Einsatzwagen Ansicht
// @namespace   leitstellenspiel
// @description Zeigt im Alarm die benötigten Fahrzeuge an
// @include     https://www.leitstellenspiel.de/missions/*
// @author      Baldy183
// @version     1.0.0
// @grant       none
// ==/UserScript==

// Fehlend NEA50; NEA200; Flughafen & Werksfeuerwehr
// Ohne Bezug Tragehilfe

(function () {
    'use strict';

    let missionHelp = $('#mission_help');
    let aaoText = ''; // Standardtext, falls keine Daten verfügbar
    let markup = '<div id="aao-info" class="alert alert-warning"></div>';

    // Füge das Markup oben auf der Seite hinzu
    $('#mission-form').prepend(markup);

    // Variablen und Cache für die Mission-Spezifikationen
    let missionID = $("#mission_help").attr('href').split("/").pop().replace(/\?.*/, '');
    let overlay = missionHelp.attr('href').match(/additive_overlays=([^&]+)/); // Überprüfe auf additive_overlays und extrahiere den Wert

    if (overlay) {
        let overlayValue = overlay[1];
        missionID += "/" + overlayValue;
    }

    let mission_specs_cache = {};

    // Funktion der Datenabfrage
    async function updateBox() {
        // Rufe die Daten ab und setze Sie auf 0 wenn nicht gefunden
        // Feuerwehr
        let LF = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.firetrucks || 0; //
        let FPersonal = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.average_min_fire_personnel || 0; //
        let Wasser = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.water_needed || 0; //
        let WasserPump = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.pump_water_amount || 0; //
        let WasserPumpSpeed = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.min_pump_speed || 0; //
        let DekonP = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.hazmat_dekon || 0; //
        let DekonPC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.hazmat_dekon || 0; //
        let DLK = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.platform_trucks || 0; //
        let DLKC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.platform_trucks || 0; //
        let ELW1 = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.battalion_chief_vehicles || 0; //
        let ELW1C = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.battalion_chief_vehicles || 0; //
        let ELW2 = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.mobile_command_vehicles || 0; //
        let ELW2C = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.mobile_command_vehicles || 0; //
        let FwK = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.fwk || 0; //
        let FwKC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.fwk || 0; //
        let GWA = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.mobile_air_vehicles || 0; //
        let GWAC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.mobile_air_vehicles || 0; //
        let GWGef = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.hazmat_vehicles || 0; //
        let GWGefC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.hazmat_vehicles || 0; //
        let GWH = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.height_rescue_units || 0; //
        let GWHC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.height_rescue_units || 0; //
        let GWMess = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.gwmess || 0; //
        let GWMessC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.gwmess || 0; //
        let GWÖl = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.gwoil || 0; //
        let GWÖlC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.gwoil || 0; //
        let RW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.heavy_rescue_vehicles || 0; //
        let RWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.heavy_rescue_vehicles || 0; //
        let SW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.water_tankers || 0; //
        let SWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.water_tankers || 0;
        let DE = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.drone || 0; //
        let DEC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.drone || 0;
        let GWT = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.diver_units || 0; //
        let GWTC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.diver_units || 0;
        // Rettungsdienst
        let RTWMin = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.possible_patient_min || 0; //
        let RTWMax = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.possible_patient || 0; //
        let NEF = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.nef || 0; //
        let RH = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.helicopter || 0; //
        let BTMin = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.care_affected_people_min || 0; //
        let BTMax = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.care_affected_people_max || 0; //
        let RHS = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.rescue_dog_units || 0; //
        let RHSC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.rescue_dog_units || 0; //
        let BuV = mission_specs_cache.filter(e => e.id == missionID)[0]?.additional?.care_includes_staff_members || false; //
        //Polizei
        let DHuFüKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.k9 || 0; //
        let DHuFüKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.k9 || 0; //
        let FuStW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.police_cars || 0; //
        let PH = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.police_helicopters || 0; //
        let PHC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.police_helicopters || 0; //
        let FuStWDGL = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.police_service_group_leader || 0; //
        let FuStWDGLC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.police_service_group_leader || 0; //
        let ZStW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.civil_patrolcar || 0; //
        let ZStWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.civil_patrolcar || 0; //
        let GefKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.gefkw || 0; //
        let GefKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.gefkw || 0; //
        //Bereitschaftspolizei
        let LeBefKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.lebefkw || 0; //
        let LeBefKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.lebefkw || 0; //
        let GruKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.grukw || 0; //
        let GruKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.grukw || 0; //
        let FüKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.fukw || 0; //
        let FüKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.fukw || 0; //
        let WW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.wasserwerfer || 0; //
        let WWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.wasserwerfer || 0; //
        //THW
        let SchmutzWPump = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.pump || 0; //
        let SchmutzWPumpC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.pump || 0; //
        let GKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_gkw || 0; //
        let GKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_gkw || 0; //
        let LKWK9 = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_lkw|| 0; //
        let LKWK9C = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_lkw || 0; //
        let MzGWFG = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_mzkw || 0; //
        let MzGWFGC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_mzkw || 0; //
        let MTWTZ = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_mtwtz || 0; //
        let MTWTZC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_mtwtz || 0; //
        let FüKomKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_command_2 || 0; //
        let FüKomKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_command_2 || 0; //
        let AnhFüLa = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_command_trailer || 0; //
        let AnhFüLaC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_command_trailer || 0; //
        let FüKWTHW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_command || 0; //
        let FüKWTHWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_command || 0; //
        let FmKW = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_command_3 || 0; //
        let FmKWC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_command_3 || 0; //
        let MTWFGrK = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_command_4 || 0; //
        let MTWFGrKC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_command_4 || 0; //
        let BRmGR = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.thw_brmg_r || 0; //
        let BRmGRC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.thw_brmg_r || 0; //
        let AnhDlE = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.mobile_air_vehicles || 0; //
        let AnhDlEC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.mobile_air_vehicles || 0; //
        let AnhB = mission_specs_cache.filter(e => e.id == missionID)[0]?.requirements?.boats || 0; //
        let AnhBC = mission_specs_cache.filter(e => e.id == missionID)[0]?.chances?.boats || 0; //
        //Sonstiges
        let credits = mission_specs_cache.filter (e => e.id == missionID)[0]?.average_credits || 0; //
        let FCredits = credits.toLocaleString('de-DE');

        // Datenprüfung und Eintragung

        // Header
        let updatedText = `<h3>Benötigte Fahrzeuge</h3> <span class="badge">für ∅ ${FCredits} Credits</span>`;
            $('#aao-info').append(updatedText + '<br>');

        // Feuerwehr
        if (LF > 0 || DekonP > 0 || DLK > 0 || ELW1 > 0 || ELW2 > 0 || FwK > 0 || GWA > 0 || GWGef > 0 || GWH > 0 || GWMess > 0 || GWÖl > 0 || RW > 0 || SW > 0  || DE > 0 || GWT > 0){
            let updatedText = `<b><u>Feuerwehr</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (LF > 0) {
            let updatedText = `${LF}x Löschfahrzeuge`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (DekonP > 0) {
            let updatedText = `${DekonP}x Dekontamination "Person"`;
            if (DekonPC > 0)
                updatedText += ` (${DekonPC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (DLK > 0) {
            let updatedText = `${DLK}x Drehleiter`;
            if (DLKC > 0)
                updatedText += ` (${DLKC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (DE > 0) {
            let updatedText = `${DE}x Drohneneinheiten`;
            if (DEC > 0)
                updatedText += ` (${DEC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (ELW1 > 0) {
            let updatedText = `${ELW1}x Einsatzleitwagen 1`;
            if (ELW1C > 0)
                updatedText += ` (${ELW1C}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (ELW2 > 0) {
            let updatedText = `${ELW2}x Einsatzleitwagen 2`;
            if (ELW2C > 0)
                updatedText += ` (${ELW2C}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FwK > 0) {
            let updatedText = `${FwK}x Feuerwehrkran`;
            if (FwKC > 0)
                updatedText += ` (${FwKC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWA > 0) {
            let updatedText = `${GWA}x Gerätewagen "Atemschutz"`;
            if (GWAC > 0)
                updatedText += ` (${GWAC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWGef > 0) {
            let updatedText = `${GWGef}x Gerätewagen "Gefahrgut"`;
            if (GWGefC > 0)
                updatedText += ` (${GWGefC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWH > 0) {
            let updatedText = `${GWH}x Gerätewagen "Höhenrettung"`;
            if (GWHC > 0)
                updatedText += ` (${GWHC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWMess > 0) {
            let updatedText = `${GWMess}x Gerätewagen "Messtechnik"`;
            if (GWMessC > 0)
                updatedText += ` (${GWMessC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWT > 0) {
            let updatedText = `${GWT}x Gerätewagen "Taucher"`;
            if (GWTC > 0)
                updatedText += ` (${GWTC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GWÖl > 0) {
            let updatedText = `${GWÖl}x Gerätewagen "Öl"`;
            if (GWÖlC > 0)
                updatedText += ` (${GWÖlC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (RW > 0) {
            let updatedText = `${RW}x Rüstwagen oder Hilfeleistungslöschgruppenfahrzeuge [HLF]`;
            if (RWC > 0)
                updatedText += ` (${RWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (SW > 0) {
            let updatedText = `${SW}x Schlauchwagen`;
            if (SWC > 0)
                updatedText += ` (${SWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }

        //Rettungsdienst
        if (RTWMax > 0 || NEF > 0 || RH > 0 || RHS > 0) {
            let updatedText = `<b><u>Rettungsdienst</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (RTWMax > 0) {
            let updatedText = `${RTWMin}`;
            if (RTWMax > RTWMin)
                updatedText += `-${RTWMax}`;
                updatedText +=`x Rettungstransportwagen`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (RHS> 0) {
            let updatedText = `${RHS}x Rettungshundefahrzeug [Staffeln]`;
            if (RHSC > 0)
                updatedText += ` (${RHSC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (NEF > 0) {
            let updatedText = `Notarzteinsatzfahrzeug benötigt (${NEF}%) -- [Ab 3 Rettungswachen möglich]`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (RH > 0) {
            let updatedText = `Rettungshubschrauber benötigt (${RH}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }

        //Polizei
        if (FuStW > 0 || PH > 0 || FuStWDGL > 0 || DHuFüKW > 0 || GefKW > 0 || ZStW > 0) {
            let updatedText = `<b><u>Polizei</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (DHuFüKW> 0) {
            let updatedText = `${DHuFüKW}x Diensthundeführerkraftwagen`;
            if (DHuFüKWC > 0)
                updatedText += ` (${DHuFüKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FuStW > 0) {
            let updatedText = `${FuStW}x Funkstreifenwagen`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FuStWDGL> 0) {
            let updatedText = `${FuStWDGL}x Funkstreifenwagen (Dienstgruppenleitung)`;
            if (FuStWDGLC > 0)
                updatedText += ` (${FuStWDGLC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GefKW> 0) {
            let updatedText = `${GefKW}x Gefangenenkraftwagen`;
            if (GefKWC > 0)
                updatedText += ` (${GefKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (PH > 0) {
            let updatedText = `${PH}x Polizeihubschrauber`;
            if (PHC > 0)
                updatedText += ` (${PHC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (ZStW > 0) {
            let updatedText = `${ZStW}x Zivilstreifenwagen`;
            if (ZStWC > 0)
                updatedText += ` (${ZStWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }

        //Bereitschaftspolizei
        if (FüKW > 0 || GruKW > 0 || LeBefKW > 0 || WW > 0) {
            let updatedText = `<b><u>Bereitschaftspolizei</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (FüKW > 0) {
            let updatedText = `${FüKW}x Führungskraftwagen`;
            if (FüKWC > 0)
                updatedText += ` (${FüKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GruKW > 0) {
            let updatedText = `${GruKW}x Gruppenkraftwagen`;
            if (GruKWC > 0)
                updatedText += ` (${GruKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (LeBefKW > 0) {
            let updatedText = `${LeBefKW}x Leichter Befehlskraftwagen`;
            if (LeBefKWC > 0)
                updatedText += ` (${LeBefKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (WW > 0) {
            let updatedText = `${WW}x Wasserwerfer`;
            if (WWC > 0)
                updatedText += ` (${WWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }

        //Technisches Hilfswerk
        if (GKW > 0 || MTWTZ > 0 || MzGWFG > 0 || SchmutzWPump > 0 || AnhFüLa > 0 || BRmGR > 0 || FmKW > 0 || FüKomKW > 0 || FüKWTHW > 0 || MTWFGrK > 0 || LKWK9 > 0 || AnhDlE > 0 || AnhB > 0) {
            let updatedText = `<b><u>Technisches Hilfswerk</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (AnhB > 0) {
            let updatedText = `${AnhB}x Anhänger mit Boote`;
            if (AnhBC > 0)
                updatedText += ` (${AnhBC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (AnhDlE > 0) {
            let updatedText = `${AnhDlE}x Anhänger Drucklufterzeugung`;
            if (AnhDlEC > 0)
                updatedText += ` (${AnhDlEC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (AnhFüLa > 0) {
            let updatedText = `${AnhFüLa}x Anhänger für Führung und Lage`;
            if (AnhFüLaC > 0)
                updatedText += ` (${AnhFüLaC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (BRmGR> 0) {
            let updatedText = `${BRmGR}x Bergeräumegerät-Radlader`;
            if (BRmGRC > 0)
                updatedText += ` (${BRmGRC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FmKW > 0) {
            let updatedText = `${FmKW}x Fernmeldekraftwagen`;
            if (FmKWC > 0)
                updatedText += ` (${FmKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FüKomKW > 0) {
            let updatedText = `${FüKomKW}x Führungs- und Kommunikationskraftwagen`;
            if (FüKomKWC > 0)
                updatedText += ` (${FüKomKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (FüKWTHW > 0) {
            let updatedText = `${FüKWTHW}x Führungskraftwagen THW`;
            if (FüKWTHWC > 0)
                updatedText += ` (${FüKWTHWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (GKW> 0) {
            let updatedText = `${GKW}x Gerätekraftwagen`;
            if (GKWC > 0)
                updatedText += ` (${GKWC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (LKWK9> 0) {
            let updatedText = `${LKWK9}x Lastkraftwagen-Kipper`;
            if (LKWK9C > 0)
                updatedText += ` (${LKWK9C}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (MTWFGrK> 0) {
            let updatedText = `${MTWFGrK}x Manschaftstransportwagen - Fachgruppe Kommunikation`;
            if (MTWFGrKC > 0)
                updatedText += ` (${MTWFGrKC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (MTWTZ> 0) {
            let updatedText = `${MTWTZ}x Manschaftstransportwagen - Technischer Zug`;
            if (MTWTZC > 0)
                updatedText += ` (${MTWTZC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (MzGWFG> 0) {
            let updatedText = `${MzGWFG}x Mehrzweck-Gerätewagen Fachgruppe N`;
            if (MzGWFGC > 0)
                updatedText += ` (${MzGWFGC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }
        if (SchmutzWPump> 0) {
            let updatedText = `${SchmutzWPump}x Schmutzwasserpumpe`;
            if (SchmutzWPumpC > 0)
                updatedText += ` (${SchmutzWPumpC}%)`;
            $('#aao-info').append(updatedText + '<br>');
        }

        //Informationen
        if (FPersonal > 0 || Wasser > 0 || WasserPump > 0 || WasserPumpSpeed > 0 || BTMin > 0 || BTMax > 0 || BuV) {
            let updatedText = `<b><u>Informationen</u></b>`
            $('#aao-info').append('<br>' + updatedText + '<br>');
        }
        if (FPersonal > 0){
            let updatedText = `[Feuerwehrleute: ∅ min.${FPersonal}]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (Wasser > 0){
            let FWasser = Wasser.toLocaleString('de-DE');
            let updatedText = `[Wasserbedarf: ${FWasser}L]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (WasserPump > 0){
            let FWasserPump = WasserPump.toLocaleString('de-DE');
            let updatedText = `[Pumpmenge: ${FWasserPump}L]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (WasserPumpSpeed > 0){
            let FWasserPumpSpeed = WasserPumpSpeed.toLocaleString('de-DE');
            let updatedText = `[Pumpenleistung: min.${FWasserPumpSpeed}L/min]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (BTMin > 0 || BTMax > 0){
            let updatedText = `[${BTMin} - ${BTMax} Betroffene]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (BuV){
            let updatedText = `[Einsatzkräfte müssen versorgt werden]`;
            $('#aao-info').append(updatedText + ' ');
        }
        if (BuV || BTMin > 0 || BTMax > 0){
            let updatedText = `[Betreuungs- und Verpflegeausstattung benötigt (∅ 1 pro 250Personen)]`;
            $('#aao-info').append(updatedText + ' ');
        }
    }

    // Funktion zum Laden der Missionsspezifikationen und Update der NA-Wahrscheinlichkeit
    async function init() {
        if (!sessionStorage.getItem("mission_specs_cache")) {
            await $.getJSON(`https://www.leitstellenspiel.de/einsaetze.json`, data => {
                mission_specs_cache = data;
                sessionStorage.setItem("mission_specs_cache", JSON.stringify(data));
            });
        } else {
            mission_specs_cache = JSON.parse(sessionStorage.getItem("mission_specs_cache"));
        }
        // Aktualisiere die Box nach dem Laden der Daten
        updateBox();
    }

    // Initialisiere die Daten
    init();

})();
