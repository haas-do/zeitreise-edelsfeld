//========================================
//Zeitsteuerung
//========================================    
//Liste der zeitabhängigen Layer ohne sonstige Filterung
const layers = [
  "Verkehrswegflaeche",
  "Hausnamen_Hausnummern",
  "Gebaeudebezeichnung"
];

//Liste der Layer, die bei aktiviertem Luftbild ausgeblendet werden
const backgroundlayers = [
    "zr_VegetationsF_Gruenland",
    "zr_VegetationsF_Gehoelz",
    "zr_VegetationsF_Hopfen",
    "zr_VegetationsF_Wald",
    "zr_SiedlungF_TagebauGrubeSteinbruch_Bergbau_Halde",
    "zr_SiedlungF_SportfreizeitundErholung",
    "zr_SiedlungF_Friedhof",
    "zr_SiedlungF_Industrie_und_Gewerbe",
    "zr_SiedlungF_Siedlung"
];

// Zeitbereich des Sliders
const minUnix = -4244572800000;   // 1835-07-01
const maxUnix = 1772319600000;  // 2026-03-01

const slider = document.getElementById("time-slider");
const label = document.getElementById("time-label");

// Slider konfigurieren
slider.min = minUnix;
slider.max = maxUnix;
slider.value = minUnix;//Standard: minUnix

// Startdatum
let currentDate = new Date(minUnix);//Standard: minUnix

// Anzeige aktualisieren
function updateLabel() {
  label.textContent = currentDate.toLocaleDateString("de-DE");
}

// Definition des Zeitfilter
function buildTimeFilter(unixTime) {
  return [
    "all",
    ["<=", ["get", "e_epoche"], unixTime],
    [
      "any",
      [">=", ["get", "u_epoche"], unixTime],
      ["!", ["has", "u_epoche"]]
    ]
  ];
}

// Anwendung des Zeitfilters und Deklarierung aller sonstigen Filter
function updateMap() {
  const unixTime = currentDate.getTime();
  const timefilter = buildTimeFilter(unixTime);

  layers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setFilter(layer, timefilter);
    }
  });

  map.setFilter("zr_VegetationsF_Gruenland", ["all",timefilter,["match",["get", "klasse"],["Grünland","Streuobstwiese","Gras"],true,false]]);
  map.setFilter("zr_VegetationsF_Gehoelz", ["all",timefilter,["match",["get", "klasse"],["Gehölz"],true,false]]);
  map.setFilter("zr_VegetationsF_Hopfen", ["all",timefilter,["match",["get", "klasse"],["Hopfen"],true,false]]);
  map.setFilter("zr_VegetationsF_Wald", ["all",timefilter,["match",["get", "klasse"],["Laub- und Nadelholz","Wald","Laubholz","Nadelholz"],true,false]]);
  map.setFilter("zr_SiedlungF_TagebauGrubeSteinbruch_Bergbau_Halde", ["all",timefilter,["match",["get", "klasse"],["Tagebau, Grube, Steinbruch", "Bergbau", "Halde"],true,false]]);
  map.setFilter("zr_SiedlungF_SportfreizeitundErholung", ["all",timefilter,["match",["get", "klasse"],["Freizeitanlage","Grünanlage","Spielplatz, Bolzplatz","Sportanlage"],true,false]]);
  map.setFilter("zr_SiedlungF_Friedhof", ["all",timefilter,["match",["get", "klasse"],["Friedhof"],true,false]]);
  map.setFilter("zr_SiedlungF_Industrie_und_Gewerbe", ["all",timefilter,["match",["get", "klasse"],["Abfallbehandlungsanlage","Bergbau","Förderanlage","Gärtnerei","Handel und Dienstleistung","Heizwerk","Industrie- und Gewerbefläche","Kläranlage, Klärwerk","Kraftwerk"],true,false]]);
  map.setFilter("zr_SiedlungF_Siedlung", ["all",timefilter,["match",["get", "klasse"],["Siedlung"],true,false]]);
  map.setFilter("zr_Gewaesser_F_See_Hafenbecken", ["all",timefilter,["match",["get", "klasse"],["Hafenbecken", "See"],true,false]]);
  map.setFilter("zr_GewaesserF_Rückhaltebecken", ["all",timefilter,["==",["get", "klasse"],"Rückhaltebecken"]]);
  map.setFilter("zr_GewaesserF_Rückhaltebecken_Kontur", ["all",timefilter,["==",["get", "klasse"],"Rückhaltebecken"]]);
  map.setFilter("zr_GewaesserF_Klaerbecken_Fuellung", ["all",timefilter,["==",["get", "klasse"],"Klärbecken"]]);
  map.setFilter("zr_GewaesserF_Klaerbecken_Kontur", ["all",timefilter,["==",["get", "klasse"],"Klärbecken"]]);
  map.setFilter("zr_Gewaesser_Linie",timefilter);
  map.setFilter("zr_POI_Baumreihe_Signaturen", ["all",timefilter,["match",["get", "klasse"],["Laubbaumreihe", "Nadelbaumreihe"],true,false]]);
  map.setFilter("zr_POI_Baum_Wald_Signaturen", ["all",timefilter,["match",["get", "klasse"],["Laubwald", "Nadelwald"],true,false]]);
  map.setFilter("zr_POI_Holz_Signaturen", ["all",timefilter,["match",["get", "klasse"],["Laubholz", "Nadelholz"],true,false]]);
  map.setFilter("zr_Kontur_Fusswege", ["all",timefilter,["match",["get", "klasse"],["Fahrwegspur","Fußweg","Pfad","Radweg"],true,false],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Kontur_Fusswege_z16", ["all",timefilter,["match",["get", "klasse"],["Fahrwegspur","Fußweg","Pfad","Radweg"],true,false],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Kontur_Wirtschaftsweg", ["all",timefilter,["match",["get", "klasse"],["Wirtschaftsweg", "Rad- und Fußweg"],true,false],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Kontur_Hauptwirtschaftsweg", ["all",timefilter,["==",["get", "klasse"],"Hauptwirtschaftsweg"],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Tunnel_Hauptwirtschaftsweg_etc", ["all",timefilter,["has", "bauwerk"],["==",["get", "bauwerk"],"Tunnel, Unterführung"],["match",["get", "klasse"],["Fahrwegspur","Hauptwirtschaftsweg","Rad- und Fußweg","Wirtschaftsweg"],true,false]]);
  map.setFilter("zr_Kontur_Gemeindestr_Sonstige_Str", ["all", timefilter,["has", "verkehrsbedeutung1"],["match",["get", "verkehrsbedeutung1"],["Anliegerstraße","Fahrradstraße","Fußgängerzone","Rastplatz-, Raststättenachse","Verkehrsberuhigter Bereich"],true,false],["!", ["has", "bauwerk"]]]);
  map.setFilter("zr_Kontur_Kreisstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Nahverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Kontur_Bundesstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Fernverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Decker_Fussweg_z16", ["all",timefilter,["match",["get", "klasse"],["Fahrwegspur", "Fußweg", "Radweg"],true,false],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Decker_Wirtschaftsweg_z15", ["all",timefilter,["match",["get", "klasse"],["Wirtschaftsweg", "Rad- und Fußweg"],true,false],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Decker_Hauptwirtschaftsweg", ["all",timefilter,["==",["get", "klasse"],"Hauptwirtschaftsweg"],["!",["has", "bauwerk"]]]);
  map.setFilter("zr_Decker_Gemeindestr_Sonstige_Str", ["all", timefilter,["has", "verkehrsbedeutung1"],["match",["get", "verkehrsbedeutung1"],["Anliegerstraße","Fahrradstraße","Fußgängerzone","Rastplatz-, Raststättenachse","Verkehrsberuhigter Bereich"],true,false],["!", ["has", "bauwerk"]]]);
  map.setFilter("zr_Decker_Kreisstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Nahverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Decker_Bundesstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Fernverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Bruecke_Wirtschaftsweg_Kontur", ["all",timefilter,["has", "bauwerk"],["match",["get", "bauwerk"],["Brücke", "Staudamm", "Steg"],true,false],["match",["get", "klasse"],["Fahrwegspur","Fußweg","Pfad","Radschnellweg","Radweg","Reitweg","Wirtschaftsweg"],true,false]]);
  map.setFilter("zr_Bruecke_Bundesstr_Kontur", ["all",timefilter,["has", "bauwerk"],["match",["get", "bauwerk"],["Brücke", "Staudamm", "Steg"],true,false],["has", "verkehrsbedeutung1"],["==",["get", "verkehrsbedeutung1"],"Fernverkehr"]]);
  map.setFilter("zr_Bruecke_Wirtschaftsweg_Decker", ["all",timefilter,["has", "bauwerk"],["match",["get", "bauwerk"],["Brücke", "Staudamm", "Steg"],true,false],["match",["get", "klasse"],["Fahrwegspur","Fußweg","Pfad","Radschnellweg","Radweg","Reitweg","Wirtschaftsweg"],true,false]]);
  map.setFilter("zr_Bruecke_Bundesstr_Decker", ["all",timefilter,["has", "bauwerk"],["match",["get", "bauwerk"],["Brücke", "Staudamm", "Steg"],true,false],["has", "verkehrsbedeutung1"],["==",["get", "verkehrsbedeutung1"],"Fernverkehr"]]);
  map.setFilter("zr_VersorgungsL_Freileitung", ["all",timefilter,["==",["get", "klasse"],"Freileitung"]]);
  map.setFilter("zr_Symbol_BauwerkP_Freileitungsmast", ["all",timefilter,["==",["get", "klasse"],"Freileitungsmast"]]);
  map.setFilter("zr_Name_GewaesserL", ["all",timefilter,["has", "name"]]);
  map.setFilter("zr_Name_Wege", ["all",timefilter,["any",["has", "name"],["has", "name_kurz"]],["match",["get", "klasse"],["Fahrwegspur","Fußweg","Hauptwirtschaftsweg","Pfad","Rad- und Fußweg","Radweg","Wirtschaftsweg"],true,false]]);   
  map.setFilter("zr_Nummer_Kreisstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Nahverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Nummer_Bundesstr", ["all",timefilter,["==",["get", "verkehrsbedeutung1"],"Fernverkehr"],["any",["has", "nummer"],["!", ["has", "bauwerk"]]]]);
  map.setFilter("zr_Name_Kreis_Gemeindestr2", ["all",timefilter,["match",["get", "verkehrsbedeutung1"],["Anliegerstraße","Fahrradstraße","Rastplatz-, Raststättenachse","Verkehrsberuhigter Bereich"],true,false],["any",["!", ["has", "fahrbahn"]],["has", "fahrbahnachse"]],["any",["has", "name"],["has", "name_kurz"]]]);
  map.setFilter("zr_Name_Kreis_Gemeindestr1", ["all",timefilter,["match",["get", "verkehrsbedeutung1"],["Nahverkehr","Ortsverbindungsstraße","Sammelverkehr"],true,false],["any",["!", ["has", "fahrbahn"]],["has", "fahrbahnachse"]],["any",["has", "name"],["has", "name_kurz"]]]);
  map.setFilter("zr_Gebaeude3D_nicht_oeffentlich", ["all",timefilter,["match",["get", "klasse"],["DTK25-NDFK","Gebäude für Wirtschaft oder Gewerbe","Wohngebäude","Überdachung","Garage","Nach Quellenlage nicht zu spezifizieren","Umformer","Wehr","Wasserbehälter","Historische Mauer","Kaserne","Tiefgarage","Parkhaus","Staumauer","Kammerschleuse"],true,false]]);
  map.setFilter("zr_Gebaeude3D_oeffentlich", ["all",timefilter,["match",["get", "klasse"],["DTK25-NDFK","Gebäude für Wirtschaft oder Gewerbe","Wohngebäude","Überdachung","Garage","Nach Quellenlage nicht zu spezifizieren","Umformer","Brücke","Wehr","Wasserbehälter","Historische Mauer","Kaserne","Tiefgarage","Parkhaus","Staumauer","Kammerschleuse"],false,true]]);
  map.setFilter("zr_Symbol_VerkehrP_Parkplatz", ["all",timefilter,["match",["get", "klasse"],["Parkplatz","Parkplatz auf Festplatz","Rastplatz"],true,false]]);
  map.setFilter("zr_Symbol_BauwerkP_Brunnen", ["all",timefilter,["match",["get", "klasse"],["Brunnen","Brunnen (Trinkwasserversorgung)"],true,false]]);
  map.setFilter("zr_Name_SiedlungF_Klaer", ["all",timefilter,["match",["get", "klasse"],["Kläranlage, Klärwerk"],true,false]]);
  map.setFilter("zr_Name_Punkt_3_nach_Flaeche", ["all",timefilter,["match",["get", "klasse"],["See","Gedenkstätte, Denkmal, Denkstein, Standbild","Sonstiges","Naturschutzgebiet","Haltepunkt","Haltestelle","Laub- und Nadelholz","Laubholz","Nadelholz","Wald","Parkplatz","Rastplatz","Raststätte","Förderanlage","Kraftwerk"],false,true],["any",["has", "name"],["has", "art"]],["case",[">=", ["zoom"], 17],true,[">=", ["zoom"], 16],[">", ["get", "flaeche"], 40],[">=", ["zoom"], 15],[">", ["get", "flaeche"], 150],[">=", ["zoom"], 14],[">", ["get", "flaeche"], 600],[">=", ["zoom"], 13],[">", ["get", "flaeche"], 2500],[">", ["get", "flaeche"], 4000]]]);
  map.setFilter("zr_Symbol_SiedlungF_Kraftwerk", ["all",timefilter,["==",["get", "klasse"],"Kraftwerk"]]);
  map.setFilter("zr_Symbol_Historischer_Punkt", ["all",timefilter,[">=", ["zoom"], 14],["match",["get", "klasse"],["Gedenkstätte, Denkmal, Denkstein, Standbild","Bildstock, Wegekreuz, Gipfelkreuz","Grab","Grabhügel (Hügelgrab)"],true,false]]);
  map.setFilter("zr_POI_Naturdenkmal_Baum", ["all",timefilter,["==",["get", "klasse"],"Naturdenkmal"],["==", ["get", "art"], "Baum"]]);
  map.setFilter("zr_POI_z16", ["all",timefilter,["match",["get", "klasse"],["Spielplatz","Barriere_offen","Barriere_geschlossen","Wassertretstelle"],true,false]]);
  map.setFilter("zr_POI_z15", ["all",timefilter,["match",["get", "klasse"],["Kindergarten/Kinderhaus","Rettungstreffpunkt"],true,false]]);
  map.setFilter("zr_POI_z14", ["all",timefilter,["match",["get", "klasse"],["Schule","Feuerwehr","Rathaus","Bildstock"],true,false]]);
  map.setFilter("zr_POI_z12", ["all",timefilter,["match",["get", "klasse"],["Aussichtsturm","Schloss/Ruine","Kirche","Anleger"],true,false]]);

}

//Update des Datums bei Veränderung des Sliders
slider.addEventListener("input", () => {
  const unixTime = parseInt(slider.value);

  currentDate = new Date(unixTime);

  updateLabel();
  updateMap();
});

// Definiton der Buttons der Zeitsteurung
document.querySelectorAll("#time-control button").forEach(btn => {
  btn.addEventListener("click", () => {
    const step = parseInt(btn.dataset.step);
    const unit = btn.dataset.unit;

    if (unit === "day") currentDate.setDate(currentDate.getDate() + step);
    if (unit === "month") currentDate.setMonth(currentDate.getMonth() + step);
    if (unit === "year") currentDate.setFullYear(currentDate.getFullYear() + step);

    let unix = currentDate.getTime();
    
    // Begrenzung der Funktionalität innerhalb des Zeitintervalls
    unix = Math.max(minUnix, Math.min(maxUnix, unix));

    currentDate = new Date(unix);
    slider.value = unix;

    updateLabel();
    updateMap();
  });
});

// Initiales Update der Zeitanzeige
updateLabel();

//========================================
//Toggle-Box
//========================================
//Aktivierung und Deaktivierung bestimmter Layer durch Toggle-Box
const hausnamenToggle = document.querySelector("#hausnamen-toggle");
const gebbezToggle = document.querySelector("#gebbez-toggle");
const luftbildToggle = document.querySelector("#luftbild-toggle");

hausnamenToggle.addEventListener("change", () => {
    if (hausnamenToggle.checked) {
        map.setLayoutProperty("Hausnamen_Hausnummern","visibility","visible")
    } else {
        map.setLayoutProperty("Hausnamen_Hausnummern", "visibility", "none")      
    }
    });

gebbezToggle.addEventListener("change", () => {
    if (gebbezToggle.checked) {
        map.setLayoutProperty("Gebaeudebezeichnung","visibility","visible")
    } else {
        map.setLayoutProperty("Gebaeudebezeichnung", "visibility", "none")      
    }
    });

luftbildToggle.addEventListener("change", () => {
    if (luftbildToggle.checked) {
        map.setLayoutProperty("dop20","visibility","visible");
        map.setLayoutProperty("zr_VegetationsF_Gruenland","visibility","none");
        map.setLayoutProperty("zr_VegetationsF_Gehoelz","visibility","none");
        map.setLayoutProperty("zr_VegetationsF_Hopfen","visibility","none");
        map.setLayoutProperty("zr_VegetationsF_Wald","visibility","none");
        map.setLayoutProperty("zr_SiedlungF_TagebauGrubeSteinbruch_Bergbau_Halde","visibility","none");
        map.setLayoutProperty("zr_SiedlungF_SportfreizeitundErholung","visibility","none");
        map.setLayoutProperty("zr_SiedlungF_Friedhof","visibility","none");
        map.setLayoutProperty("zr_SiedlungF_Industrie_und_Gewerbe","visibility","none");
        map.setLayoutProperty("zr_SiedlungF_Siedlung","visibility","none");
        map.setLayoutProperty("hintergrund","visibility","none");
        map.setPaintProperty("zr_Gebaeude3D_nicht_oeffentlich","fill-extrusion-color","rgb(178, 38, 38)");
        map.setPaintProperty("zr_Gebaeude3D_oeffentlich","fill-extrusion-color","rgb(178,38,38)")
    } else {
        map.setLayoutProperty("dop20","visibility","none");
        map.setLayoutProperty("zr_VegetationsF_Gruenland", "visibility", "visible");
        map.setLayoutProperty("zr_VegetationsF_Gehoelz", "visibility", "visible");
        map.setLayoutProperty("zr_VegetationsF_Hopfen","visibility","visible");
        map.setLayoutProperty("zr_VegetationsF_Wald","visibility","visible");
        map.setLayoutProperty("zr_SiedlungF_TagebauGrubeSteinbruch_Bergbau_Halde","visibility","visible");
        map.setLayoutProperty("zr_SiedlungF_SportfreizeitundErholung","visibility","visible");
        map.setLayoutProperty("zr_SiedlungF_Friedhof","visibility","visible");
        map.setLayoutProperty("zr_SiedlungF_Industrie_und_Gewerbe","visibility","visible");
        map.setLayoutProperty("zr_SiedlungF_Siedlung","visibility","visible");
        map.setLayoutProperty("hintergrund","visibility","visible");
        map.setPaintProperty("zr_Gebaeude3D_nicht_oeffentlich","fill-extrusion-color","rgb(179,179,179)");
        map.setPaintProperty("zr_Gebaeude3D_oeffentlich","fill-extrusion-color","rgb(193,160,161)")

    }
    });

//========================================
//Karteninhalt
//========================================
//Initialisierung und Variablendeklarierung zur Verwendung von PMTiles
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const p = new pmtiles.PMTiles("zeitreise_3857.pmtiles");
protocol.add(p);

//Laden der Kartenquellen und Layer
const map = new maplibregl.Map({
        container: 'map',
        style: 'https://vtod1.bayernwolke.de/styles/by_style_light.json',
        hash:true,
        zoom: 16,
        center: [11.69573, 49.57710],
        minZoom: 12,           // Minimaler Zoom
        maxZoom: 20,          // Maximaler Zoom
        maxBounds: [
            [11.55177, 49.48522], // Südwestliche räumliche Begrenzung der Karte
            [11.83918, 49.67145] // Nordöstliche Begrenzung der Karte
        ]
    });

    //Festlegen der Steuerungsoptionen
    map.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true
    }));

    //Kartentitel
    // Ausblenden des Titels nach 5 Sekunden
    function hideTitle() {
    document.getElementById("mapTitle").classList.add("hide");
    }

    map.once("dragstart", hideTitle);
    map.once("zoomstart", hideTitle);
    map.once("rotatestart", hideTitle);

    setTimeout(hideTitle, 5000);


    map.on('load', () => {
        map.addSource('zr', {
            type: 'vector',
            url: "pmtiles://https://haas-do.github.io/zeitreise-edelsfeld/data/pmtiles-3857/zeitreise_3857.pmtiles"
            //url: "pmtiles://https://dhthws1.github.io/zeitreise-edelsfeld-test/zeitreise3857.pmtiles"
        }
    );
    map.addSource('wms', {
        type: 'raster',
        tiles: [
            "https://geoservices.bayern.de/od/wms/dop/v1/dop20?bbox={bbox-epsg-3857}&service=WMS&version=1.1.0&request=GetMap&layers=by_dop20c&styles=&srs=EPSG:3857&width=256&height=256&format=image/png&transparent=true"
        ],
        tileSize: 256
    });

        map.addLayer({
            id: 'dop20',
            type: 'raster',
            source: 'wms',
            paint: {},
            "layout": {"visibility": "none"}
        });
    
        
        map.addLayer({
            "id": "hintergrund",
            "type": "fill",
            "source": "zr",
            "source-layer": "Hintergrund",
            "minzoom": 6,
            "paint": {
                "fill-color":"rgb(255, 253, 243)"}
            }
        );

        map.addLayer({
            "id": "zr_VegetationsF_Gruenland",
            "type": "fill",
            "source": "zr",
            "source-layer": "Vegetationsflaeche",
            "minzoom": 14,
            "filter": [
                "match",
                ["get", "klasse"],
                [
                "Grünland",
                "Streuobstwiese",
                "Gras"
                ],
                true,
                false
            ],
            "paint": {
                "fill-color": "rgb(244, 250, 229)",
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                0,
                15,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_VegetationsF_Gehoelz",
            "type": "fill",
            "source": "zr",
            "source-layer": "Vegetationsflaeche",
            "minzoom": 11,
            "paint": {
                "fill-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                "rgb(223,240,182)",
                22,
                "rgb(154,182,109)"
                ],
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0.5,
                16,
                0.7
                ]
            }
        });

        map.addLayer({
            "id": "zr_VegetationsF_Hopfen",
            "type": "fill",
            "source": "zr",
            "source-layer": "Vegetationsflaeche",
            "minzoom": 14,
            "paint": {
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                0.2,
                22,
                1
                ],
                "fill-pattern": [
                "step",
                ["zoom"],
                "M_hopfen_1",
                15,
                "M_hopfen_2",
                16,
                "M_hopfen_3"
                ]
            }
        });

        map.addLayer({
            "id": "zr_VegetationsF_Wald",
            "type": "fill",
            "source": "zr",
            "source-layer": "Vegetationsflaeche",
            "minzoom": 6,
            "paint": {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    11,
                    "rgb(223,240,182)",
                    22,
                    "rgb(154,182,109)"
                ],
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    6,
                    0.3,
                    8,
                    1
                    ]}
            }
        );

        map.addLayer({
            "id": "zr_SiedlungF_TagebauGrubeSteinbruch_Bergbau_Halde",
            "type": "fill",
            "source": "zr",
            "source-layer": "Siedlungsflaeche",
            "minzoom": 11,
            "paint": {
                "fill-color": "rgb(214,210,219)"
            }
        });

        map.addLayer({
            "id": "zr_SiedlungF_SportfreizeitundErholung",
            "type": "fill",
            "source": "zr",
            "source-layer": "Siedlungsflaeche",
            "minzoom": 11,
            "paint": {
                "fill-color": "rgb(230,247,210)",
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                0,
                12,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_SiedlungF_Friedhof",
            "type": "fill",
            "source": "zr",
            "source-layer": "Siedlungsflaeche",
            "minzoom": 11,
            "paint": {
                "fill-color": "rgb(244, 250, 229)"
            }
                    });

        map.addLayer({
            "id": "zr_SiedlungF_Industrie_und_Gewerbe",
            "type": "fill",
            "source": "zr",
            "source-layer": "Siedlungsflaeche",
            "minzoom": 9,
            "paint": {
                "fill-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                9,
                "rgb(235,223,231)",
                11,
                "rgb(242,226,239)",
                12,
                "rgb(221,218,226)"
                ]
            }
        });

        map.addLayer({
            "id": "zr_SiedlungF_Siedlung",
            "type": "fill",
            "source": "zr",
            "source-layer": "Siedlungsflaeche",
            "minzoom": 8,
            "paint": {
                "fill-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                9,
                "rgb(235, 223, 231)",
                11,
                "rgb(242,226,239)",
                12,
                "rgb(240, 230, 239)"
                ],
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                0,
                9,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_Gewaesser_F_See_Hafenbecken",
            "type": "fill",
            "source": "zr",
            "source-layer": "Gewaesserflaeche",
            "minzoom": 6,
            "paint": {
                "fill-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,
                "#FFFDEE",
                7,
                "#A5BEEB"
                ]
            }
            }
        );

        map.addLayer({
            "id": "zr_GewaesserF_Rückhaltebecken",
            "type": "fill",
            "source": "zr",
            "source-layer": "Gewaesserflaeche",
            "minzoom": 13,
            "paint": {
                "fill-color": "#A5BEEB",
                "fill-opacity": 0.5
            }
            }
        );

        map.addLayer({
            "id": "zr_GewaesserF_Rückhaltebecken_Kontur",
            "type": "line",
            "source": "zr",
            "source-layer": "Gewaesserflaeche",
            "minzoom": 14,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-blur": 1,
                "line-color": "rgb(170, 190, 230)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                2,
                20,
                4
                ],
                "line-dasharray": [2, 2]
            }
            }
        );

        map.addLayer({
            "id": "zr_GewaesserF_Klaerbecken_Fuellung",
            "type": "fill",
            "source": "zr",
            "source-layer": "Gewaesserflaeche",
            "minzoom": 13,
            "paint": {
                "fill-color": "#A5BEEB",
                "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0.125,
                14,
                0.7,
                20,
                1
                ]
            }
            }
        );

        map.addLayer({
            "id": "zr_GewaesserF_Klaerbecken_Kontur",
            "type": "line",
            "source": "zr",
            "source-layer": "Gewaesserflaeche",
            "minzoom": 13,
            "paint": {
                "line-color": "rgb(199, 178, 93)",
                "line-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0.5,
                15,
                1
                ],
                "line-width": 1.5
            }
            }
        );

        map.addLayer({
            "id": "Verkehrswegflaeche",
            "type": "fill",
            "source": "zr",
            "source-layer": "Verkehrswegflaeche",
            "minzoom": 18,
            "layout":{"visibility": "none"},
            "paint": {
                "fill-color":"rgb(90,90,90)",
                "fill-outline-color":"rgb(90,90,90)"}
            }
        );

        
        map.addLayer({
            "id": "zr_Gewaesser_Linie",
            "type": "line",
            "source": "zr",
            "source-layer": "Gewaesserlinie",
            "minzoom": 6,
            "paint": {
                "line-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,
                "#FFFDEE",
                7.5,
                "#A5BEEB"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,
                1,
                7,
                1.5,
                8,
                [
                    "case",
                    [">=", ["get", "breite"], 125],
                    2,
                    0.6
                ],
                9,
                [
                    "case",
                    [">=", ["get", "breite"], 125],
                    3,
                    [">=", ["get", "breite"], 30],
                    2,
                    [">=", ["get", "breite"], 18],
                    1.5,
                    1
                ],
                10,
                [
                    "case",
                    [">=", ["get", "breite"], 42],
                    3,
                    [">=", ["get", "breite"], 30],
                    2.5,
                    [">=", ["get", "breite"], 18],
                    2,
                    [">=", ["get", "breite"], 12],
                    1.5,
                    [">=", ["get", "breite"], 6],
                    1,
                    0.5
                ],
                11,
                [
                    "case",
                    [">=", ["get", "breite"], 42],
                    4,
                    [">=", ["get", "breite"], 30],
                    3,
                    [">=", ["get", "breite"], 18],
                    2.5,
                    [">=", ["get", "breite"], 12],
                    2,
                    [">=", ["get", "breite"], 6],
                    1.5,
                    1
                ],
                16,
                [
                    "case",
                    [">=", ["get", "breite"], 12],
                    7,
                    [">=", ["get", "breite"], 6],
                    3,
                    2
                ],
                22,
                [
                    "case",
                    [">=", ["get", "breite"], 12],
                    9,
                    [">=", ["get", "breite"], 6],
                    7,
                    5
                ]
                ]
            }
        });

        map.addLayer({
            "id": "zr_POI_Baumreihe_Signaturen",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Vegetationspunkt_2",
            "minzoom": 14.5,
            "maxzoom": 16.1,
            "layout": {
                "icon-image": ["get", "klasse"],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map",
                "icon-offset": [0, -6],
                "icon-padding": 0
            }
        });

        map.addLayer({
            "id": "zr_POI_Baum_Wald_Signaturen",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Vegetationspunkt_2",
            "minzoom": 14.5,
            "layout": {
                "icon-image": ["get", "klasse"],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map",
                "icon-offset": [0, -8],
                "icon-padding": 0
            }
        });

        map.addLayer({
            "id": "zr_POI_Holz_Signaturen",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Vegetationspunkt_2",
            "minzoom": 15.5,
            "layout": {
                "icon-image": ["get", "klasse"],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map",
                "icon-padding": 0
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Fusswege",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14,
            "maxzoom": 16,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "rgb(128, 128, 128)",
                "line-dasharray": [4, 3],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                1,
                15,
                1.5,
                16,
                2
                ]
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Fusswege_z16",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 16,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "rgb(128, 128, 128)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                16,
                3.5,
                20,
                16
                ]
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Wirtschaftsweg",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 12,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(128, 128, 128)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0.5,
                14,
                1,
                14.99,
                1.5,
                15,
                3.5,
                16,
                5,
                20,
                22
                ]
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Hauptwirtschaftsweg",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 12,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(128, 128, 128)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                2.5,
                14,
                3.5,
                16,
                7,
                20,
                30
                ]
            }
        });

        map.addLayer({
            "id": "zr_Tunnel_Hauptwirtschaftsweg_etc",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(127,127,127)",
                "line-dasharray": [2, 2],
                "line-opacity": 0.5,
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                2,
                20,
                4
                ]
            }
            }            
        );

        map.addLayer({
            "id": "zr_Kontur_Gemeindestr_Sonstige_Str",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(201, 201, 201)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,0,
                12,2,
                13,3,
                14,4,
                16,8,
                20,40
                ]
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Kreisstr",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                "rgb(201, 201, 201)",
                12,
                "rgb(153,153,153)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,3,
                12,3.5,
                13,4,
                14,6,
                16,
                10,
                20,
                44
                ]
            }
        });

        map.addLayer({
            "id": "zr_Kontur_Bundesstr",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(255, 151, 79)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,3,
                12,4,
                13,5.5,
                14,7,
                16,
                10,
                20,
                44
                ]
            }
        });

        map.addLayer({
            "id": "zr_Decker_Fussweg_z16",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 15.9,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "case",
                [
                    "all",
                    ["has", "oberflaeche"],
                    [
                    "match",
                    ["get", "oberflaeche"],
                    [
                        "Beton, Asphalt, Pflaster",
                        "befestigt, asphaltiert, betoniert, gepflastert"
                    ],
                    true,
                    false
                    ]
                ],
                "rgb(255, 255, 255)",
                "rgb(246,238,204)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                16,
                2.5,
                20,
                14
                ]
            }
        });

        map.addLayer({
            "id": "zr_Decker_Wirtschaftsweg_z15",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 15,
            "layout": {
                "line-sort-key": [
                "case",
                [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                ],
                1,
                10
                ],
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "case",
                [
                    "all",
                    ["has", "oberflaeche"],
                    [
                    "match",
                    ["get", "oberflaeche"],
                    [
                        "Beton, Asphalt, Pflaster",
                        "befestigt, asphaltiert, betoniert, gepflastert"
                    ],
                    true,
                    false
                    ]
                ],
                "rgb(255, 255, 255)",
                "rgb(246,238,204)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                2.5,
                16,
                4,
                20,
                20
                ]
            }
            });

        map.addLayer({
            "id": "zr_Decker_Hauptwirtschaftsweg",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 12,
            "layout": {
                "line-sort-key": [
                "case",
                [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                ],
                1,
                10
                ],
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "case",
                [
                    "all",
                    ["has", "oberflaeche"],
                    [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                    ]
                ],
                "rgb(246,238,204)",
                "rgb(255, 255, 255)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                1.5,
                14,
                2.5,
                16,
                6,
                20,
                27
                ]
            }
        });

        map.addLayer({
            "id": "zr_Decker_Gemeindestr_Sonstige_Str",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 12,
            "layout": {
                "line-sort-key": [
                "case",
                [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                ],
                1,
                [
                    "==",
                    ["get", "verkehrsbedeutung1"],
                    "Fußgängerzone"
                ],
                2,
                10
                ],
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "case",
                [
                    "==",
                    ["get", "verkehrsbedeutung1"],
                    "Fußgängerzone"
                ],
                "rgb(182,223,210)",
                [
                    "all",
                    ["has", "oberflaeche"],
                    [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                    ]
                ],
                "rgb(246,238,204)",
                "rgb(255, 255, 255)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,1,
                13,1.5,
                14,3,
                16,6,
                20,36
                ]
            }
        });

        map.addLayer({
            "id": "zr_Decker_Kreisstr",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(255,255,255)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,1.2,
                12,2.1,
                13,3,
                14,5,
                16,
                8,
                20,
                40
                ]
            }
        })

        map.addLayer({
              "id": "zr_Decker_Bundesstr",
                "type": "line",
                "source": "zr",
                "source-layer": "Verkehrslinie",
                "minzoom": 11,
                "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                },
                "paint": {
                    "line-color": "rgb(255,203,79)",
                    "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    11,2,
                    12,3,
                    13,4,
                    14,5.5,
                    16,8.5,
                    20,
                    40
                    ]
                }
        });

        map.addLayer({
            "id": "zr_Bruecke_Wirtschaftsweg_Kontur",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14,
            "layout": {"line-join": "round"},
            "paint": {
                "line-color": "rgb(153,153,153)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                4.5,
                16,
                6,
                20,
                24
                ]
            }
            }
        );

        map.addLayer({
            "id": "zr_Bruecke_Bundesstr_Kontur",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {"line-join": "round"},
            "paint": {
                "line-color": "rgb(255, 151, 79)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,3,
                12,3,
                13,4,
                14,8,
                16,
                14,
                20,
                46
                ]
            }
            }
        );

        map.addLayer({
            "id": "zr_Bruecke_Wirtschaftsweg_Decker",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14,
            "layout": {
                "line-sort-key": [
                "case",
                [
                    "==",
                    ["get", "oberflaeche"],
                    "geschottert, gekiest"
                ],
                1,
                10
                ],
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                "rgb(255, 255, 255)",
                16,
                "rgb(246,238,204)"
                ],
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                1,
                14,
                2,
                15.99,
                3,
                16,
                4,
                20,
                20
                ]
            }
            }
        );

        map.addLayer(
            {
            "id": "zr_Bruecke_Bundesstr_Decker",
            "type": "line",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 11,
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgb(255,203,79)",
                "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,1.5,
                12,1.5,
                13,2.5,
                14,4.5,
                16,8.5,
                20,
                40
                ]
                }
            }
        );

        map.addLayer({
            "id": "zr_VersorgungsL_Freileitung",
            "type": "line",
            "source": "zr",
            "source-layer": "Versorgungslinie",
            "minzoom": 12,
            "paint": {
                "line-color": "rgb(188,111,78)",
                "line-opacity": 0.5,
                "line-width": 1.2
            }
        });

        map.addLayer({
            "id": "zr_Symbol_BauwerkP_Freileitungsmast",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Bauwerkspunkt",
            "minzoom": 12,
            "layout": {
                "icon-image": [
                "image",
                "Freileitungsmast"
                ],
                "icon-ignore-placement": true,
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0.5,
                18,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map"
            }
        });

        map.addLayer({
            "id": "zr_Name_GewaesserL",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Gewaesserlinie",
            "minzoom": 13,
            "layout": {
                "symbol-placement": "line",
                "text-field": [
                "case",
                ["has", "zweitname"],
                [
                    "concat",
                    ["get", "name"],
                    " (",
                    ["get", "zweitname"],
                    ")"
                ],
                ["get", "name"]
                ],
                "text-anchor": "bottom",
                "text-font": ["Noto Sans Italic"],
                "text-max-angle": 20,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                10,
                20,
                14
                ],
                "text-letter-spacing": 0.1,
                "text-line-height": 1
            },
            "paint": {
                "text-color": "#2E65E4",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1
            }
        });

        map.addLayer({
            "id": "zr_Name_Wege",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 15,
            "layout": {
                "symbol-placement": "line-center",
                "text-field": [
                "step",
                ["zoom"],
                [
                    "coalesce",
                    ["get", "name_kurz"],
                    ["get", "name"]
                ],
                17,
                ["get", "name"]
                ],
                "text-font": ["Noto Sans Regular"],
                "text-letter-spacing": 0.08,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                16
                ],
                "text-padding": 0
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,255,255)",
                "text-halo-width": 2
            }
        });

        map.addLayer({
            "id": "zr_Nummer_Kreisstr",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 13,
            "layout": {
                "symbol-placement": "line",
                "text-field": [
                "to-string",
                ["get", "nummer"]
                ],
                "text-font": ["Noto Sans Regular"],
                "text-justify": "auto",
                "text-max-angle": 15,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                16
                ],
                "text-padding": 0,
                "symbol-spacing": [
                "step",
                ["zoom"],
                250,
                20,
                600
                ]
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-color": "rgb(255, 253, 243)",
                "text-halo-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                1,
                16,
                0
                ],
                "text-halo-blur": 1
            }
        });

        map.addLayer({
              "id": "zr_Nummer_Bundesstr",
                "type": "symbol",
                "source": "zr",
                "source-layer": "Verkehrslinie",
                "minzoom": 9,
                "layout": {
                    "symbol-placement": "line",
                    "icon-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    0.5,
                    20,
                    0.7
                    ],
                    "text-field": ["get", "nummer"],
                    "text-allow-overlap": true,
                    "text-font": ["Noto Sans Regular"],
                    "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    9,
                    10,
                    9,
                    12,
                    9,
                    14,
                    12
                    ],
                    "text-rotation-alignment": "viewport",
                    "icon-rotation-alignment": "viewport",
                    "icon-pitch-alignment": "map",
                    "text-pitch-alignment": "map",
                    "text-padding": 0,
                    "icon-padding": 0,
                    "icon-image": [
                    "match",
                    [
                        "length",
                        ["to-string", ["get", "nummer"]]
                    ],
                    2,
                    [
                        "image",
                        "Bundesstrassennummer_2"
                    ],
                    3,
                    [
                        "image",
                        "Bundesstrassennummer_2"
                    ],
                    ["image", "Bundesstrassennummer"]
                    ]
                },
                "paint": {
                    "text-color": "rgb(51,51,51)"
                }
        });

        map.addLayer({
            "id": "zr_Name_Kreis_Gemeindestr2",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14.5,
            "layout": {
                "symbol-placement": [
                "step",
                ["zoom"],
                "line",
                16,
                "line-center"
                ],
                "text-field": [
                "step",
                ["zoom"],
                [
                    "coalesce",
                    ["get", "name_kurz"],
                    ["get", "name"]
                ],
                17,
                ["get", "name"]
                ],
                "text-font": ["Noto Sans Regular"],
                "text-justify": "auto",
                "text-letter-spacing": 0.05,
                "text-max-width": 50,
                "text-padding": 0,
                "text-pitch-alignment": "map",
                "text-rotation-alignment": "map",
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                16
                ]
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,255,255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_Name_Kreis_Gemeindestr1",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 13.5,
            "layout": {
                "symbol-placement": [
                "step",
                ["zoom"],
                "line",
                16,
                "line-center"
                ],
                "text-field": ["get", "name"],
                "text-font": ["Noto Sans Regular"],
                "text-justify": "auto",
                "text-letter-spacing": 0.05,
                "text-max-width": 50,
                "text-padding": 0,
                "text-pitch-alignment": "map",
                "text-rotation-alignment": "map",
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                16
                ]
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,255,255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_Name_Bruecken_Blocker",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrslinie",
            "minzoom": 14,
            "filter": [
                "any",
                [
                "all",
                ["has", "bauwerk"],
                [
                    "match",
                    ["get", "bauwerk"],
                    ["Brücke", "Steg"],
                    true,
                    false
                ]
            ],
            ],
            "layout": {
                "text-font": ["Noto Sans Regular"],
                "text-field": "x",
                "symbol-placement": "line",
                "symbol-spacing": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                5,
                20,
                25
                ],
                "text-padding": 0,
                "text-line-height": 1,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                10,
                20,
                24
                ],
                "text-keep-upright": false
            },
            "paint": {"text-opacity": 0}
            }
        );

        map.addLayer({
            "id": "zr_Symbol_BauwerkP_Kellereingang",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Bauwerkspunkt",
            "minzoom": 15.5,
            "filter": [
                "==",
                ["get", "klasse"],
                "Kellereingang"
            ],
            "layout": {
                "icon-image": [
                "image",
                "Kellereingang"
                ],
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.3,
                20,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map",
                "icon-offset": [0, -10]
            }
        });
        
        map.addLayer({
            'id': 'zr_Gebaeude3D_nicht_oeffentlich',
            'type': 'fill-extrusion',
            'source': 'zr',
            'source-layer': 'Gebaeudeflaeche',
            "minzoom": 14,
            "paint": {
            "fill-extrusion-color": "rgb(179,179,179)",
            "fill-extrusion-height": [
            "get",
            "hoehe"
            ],
            "fill-extrusion-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                0,
                14.5,
                0.7
                ]
        }
        });

        
        map.addLayer({
            'id': 'zr_Gebaeude3D_oeffentlich',
            'type': 'fill-extrusion',
            'source': 'zr',
            'source-layer': 'Gebaeudeflaeche',
            "minzoom": 14.5,
            "paint": {
            "fill-extrusion-color": "rgb(193,160,161)",
            "fill-extrusion-height": [
            "get",
            "hoehe"
            ],
            "fill-extrusion-opacity": 0.7
        }
        });

        map.addLayer({
            "id": "zr_Symbol_VerkehrP_Parkplatz",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Verkehrspunkt_2",
            "minzoom": 15,
            "layout": {
                "icon-image": [
                "image",
                "Wanderparkplatz"
                ],
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.4,
                20,
                1
                ],
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "viewport",
                "text-font": ["Noto Sans Medium"],
                "text-field": [
                "step",
                ["zoom"],
                "",
                16,
                [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                ]
                ],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-padding": 0,
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-radial-offset": 1.3,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": "rgb(14,75,185)",
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1.5,
                "text-halo-blur": 0.5
            }
        });

        map.addLayer({
            "id": "zr_Symbol_BauwerkP_Brunnen",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Bauwerkspunkt",
            "minzoom": 15,
            "layout": {
                "icon-image": [
                "image",
                "Brunnen_Trinkwasserversorgung"
                ],
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "text-font": ["Noto Sans Italic"],
                "text-field": [
                "match",
                ["get", "klasse"],
                ["Brunnen"],
                ["get", "name"],
                ""
                ],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                11,
                20,
                16
                ],
                "text-optional": true,
                "icon-rotation-alignment": "viewport",
                "icon-pitch-alignment": "map",
                "text-pitch-alignment": "viewport",
                "text-rotation-alignment": "viewport",
                "text-variable-anchor": [
                "bottom",
                "top"
                ],
                "text-radial-offset": 1,
                "text-line-height": 1,
                "text-padding": 0
            },
            "paint": {
                "text-color": "rgb(14,75,185)",
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1,
                "text-halo-blur": 0.5,
                "text-opacity": [
                "step",
                ["zoom"],
                0,
                16,
                1
                ]
            }
        });


        map.addLayer({
            "id": "zr_Name_SiedlungF_Klaer",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_3",
            "minzoom": 14.5,
            "layout": {
                "text-field": "Klär",
                "text-font": ["Noto Sans Italic"],
                "text-padding": 0,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                15
                ],
                "text-rotation-alignment": "viewport",
                "text-pitch-alignment": "map"
            },
            "paint": {
                "text-color": "#2E65E4",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_Name_Punkt_3_nach_Flaeche",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_3",
            "minzoom": 12,
            "layout": {
                "text-field": [
                "to-string",
                [
                    "coalesce",
                    ["get", "name"],
                    ["get", "art"]
                ]
                ],
                "text-font": ["Noto Sans Italic"],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "center",
                "bottom",
                "top"
                ]
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255,255,255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_Symbol_SiedlungF_Kraftwerk",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_3",
            "minzoom": 13,
            "layout": {
                "icon-image": [
                "image","Kraftwerk"
                ],
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_Symbol_Historischer_Punkt",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Historischer_Punkt",
            "minzoom": 13,
            "layout": {
                "icon-image": [
                "match",
                ["get", "klasse"],
                [
                    "Meilenstein, historischer Grenzstein"
                ],
                ["image", "Grenzstein"],
                ["Wachturm (römisch), Warte"],
                ["image", "Aussichtsturm"],
                [
                    "Bildstock, Wegekreuz, Gipfelkreuz"
                ],
                ["image", "Bildstock"],
                [
                    "Gedenkstätte, Denkmal, Denkstein, Standbild"
                ],
                ["image", "Denkmal"],
                ["image", "Grabhuegel"]
                ],
                "icon-padding": 0,
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                [
                    "match",
                    ["get", "klasse"],
                    [
                    "Bildstock, Wegekreuz, Gipfelkreuz"
                    ],
                    0.3,
                    0.5
                ],
                20,
                1
                ],
                "text-field": [
                "to-string",
                ["get", "name"]
                ],
                "text-font": {
                "stops": [
                    [15, ["Noto Sans Regular"]],
                    [17, ["Noto Sans Medium"]]
                ]
                },
                "text-radial-offset": 1.3,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-padding": 0,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 1.5,
                "text-opacity": [
                "step",
                ["zoom"],
                0,
                15,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_POI_Naturdenkmal_Baum",
            "type": "symbol",
            "source": "zr",
            "source-layer": "POI_Punkt",
            "minzoom": 15,
            "layout": {
                "icon-image": [
                "image",
                ["get", "bewuchs"]
                ],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "text-font": ["Noto Sans Italic"],
                "text-field": "ND",
                "text-anchor": "bottom-left",
                "text-radial-offset": 0.6,
                "text-optional": true,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                11,
                20,
                16
                ],
                "icon-offset": [0, -10],
                "icon-padding": 0,
                "text-padding": 0
            },
            "paint": {
                "text-color": "rgb(51, 153, 51)",
                "text-halo-color": "#fffdee",
                "text-halo-width": 1.5,
                "text-halo-blur": 0.5,
                "text-opacity": [
                "step",
                ["zoom"],
                0,
                17,
                1
                ]
            }
        });

        map.addLayer({
            "id": "zr_POI_z16",
            "type": "symbol",
            "source": "zr",
            "source-layer": "POI_Punkt",
            "minzoom": 16,
            "layout": {
                "icon-image": [
                "match",
                ["get", "klasse"],
                ["Barriere_offen"],["image","Bewegliche_Barriere_Schranke"],
                ["Barriere_geschlossen"],["image", "Feste_Barriere"],
                ["image", ["get", "klasse"]]
                ],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-padding": 0,
                "text-field": [
                "step",
                ["zoom"],
                "",
                17,
                [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                ]
                ],
                "text-font": ["Noto Sans Medium"],
                "text-radial-offset": 1.3,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-padding": 0,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": [
                "match",
                ["get", "klasse"],
                ["Wassertretstelle"],
                "rgb(14,75,185)",
                ["Spielplatz"],
                "rgb(5,150,97)",
                "rgb(51,51,51)"
                ],
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_POI_z15",
            "type": "symbol",
            "source": "zr",
            "source-layer": "POI_Punkt",
            "minzoom": 15,
            "layout": {
                "icon-image": [
                "match",
                ["get", "klasse"],
                "Kindergarten/Kinderhaus",
                "Kindergarten",
                ["get", "klasse"]
                ],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-padding": 0,
                "text-field": [
                "step",
                ["zoom"],
                "",
                16,
                [
                    "match",
                    ["get", "klasse"],
                    [
                    "Geotop",
                    "Rettungstreffpunkt",
                    "Parkhaus"
                    ],
                    [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                    ],
                    ""
                ],
                17,
                [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                ]
                ],
                "text-font": ["Noto Sans Medium"],
                "text-radial-offset": 1.3,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-padding": 0,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": [
                "match",
                ["get", "klasse"],
                [
                    "Waldkindergarten",
                    "Kindergarten/Kinderhaus"
                ],
                "rgb(125, 22, 189)",
                "Parkhaus",
                "rgb(14,75,185)",
                "Geotop",
                "rgb(123,49,9)",
                "Rettungstreffpunkt",
                "rgb(51, 153, 51)",
                "rgb(51,51,51)"
                ],
                "text-halo-blur": 0.5,
                "text-halo-color": [
                "case",
                [
                    "==",
                    ["get", "klasse"],
                    "Geotop"
                ],
                "rgb(255,253,238)",
                [
                    "==",
                    ["get", "klasse"],
                    "Rettungstreffpunkt"
                ],
                "rgb(255,253,238)",
                "rgb(255, 255, 255)"
                ],
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_POI_z14",
            "type": "symbol",
            "source": "zr",
            "source-layer": "POI_Punkt",
            "minzoom": 14,
            "layout": {
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                [
                    "match",
                    ["get", "klasse"],
                    ["Bildstock"],
                    0.3,
                    0.5
                ],
                20,
                1
                ],
                "icon-image": [
                "match",
                ["get", "klasse"],
                ["Haus/Hütte"],
                [
                    "match",
                    ["get", "art"],
                    "Herberge",
                    ["image", "Herberge"],
                    "Wirtshaus, bewirtschaftete Alm",
                    ["image", "Wirtshaus"],
                    "Hütte",
                    ["image", "Haus_Huette"],
                    "Jagdhütte",
                    ["image", "Haus_Huette"],
                    "Diensthütte",
                    ["image", "Haus_Huette"],
                    "Bergwachthütte",
                    ["image", "Haus_Huette"],
                    ["image", "Unterstand"]
                ],
                ["Segeln/Surfen"],
                ["image", "Segeln_surfen"],
                ["Wildfütterung"],
                ["image", "Wildfuetterung"],
                ["Bad"],
                [
                    "match",
                    ["get", "art"],
                    [
                    "Badeplatz",
                    "Freibad",
                    "Strandbad"
                    ],
                    ["image", "Schwimmbad"],
                    ["image", "Hallenbad"]
                ],
                ["Veranstaltungsort"],
                [
                    "match",
                    ["get", "art"],
                    [
                    "Theater, Oper, Konzertgebäude"
                    ],
                    ["image", "Theater"],
                    ["image", "Gemeindezentrum"]
                ],
                ["image", ["get", "klasse"]]
                ],
                "icon-padding": 0,
                "icon-offset": [
                "match",
                ["get", "klasse"],
                "Bildstock",
                ["literal", [0, -8]],
                ["literal", [0, 0]]
                ],
                "text-field": [
                "step",
                ["zoom"],
                "",
                17,
                [
                    "match",
                    ["get", "klasse"],
                    "Rathaus",
                    "Rathaus",
                    "Landratsamt",
                    "Landratsamt",
                    "Haus/Hütte",
                    [
                    "case",
                    [
                        "==",
                        ["get", "zustand"],
                        "Außer Betrieb, stillgelegt, verlassen"
                    ],
                    [
                        "format",
                        [
                        "coalesce",
                        [
                            "get",
                            "name_alternativ"
                        ],
                        ["get", "name"],
                        ""
                        ],
                        [
                        "concat",
                        " (",
                        ["get", "zustand"],
                        ")"
                        ],
                        {
                        "font-scale": 0.9,
                        "text-font": [
                            "literal",
                            ["Noto Sans Italic"]
                        ]
                        }
                    ],
                    [
                        "coalesce",
                        ["get", "name_alternativ"],
                        ["get", "name"],
                        ""
                    ]
                    ],
                    [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                    ]
                ],
                18,
                [
                    "match",
                    ["get", "klasse"],
                    "Rathaus",
                    [
                    "concat",
                    "Rathaus ",
                    [
                        "coalesce",
                        ["get", "name_alternativ"],
                        ["get", "name"],
                        ""
                    ]
                    ],
                    "Landratsamt",
                    [
                    "concat",
                    "Landratsamt ",
                    [
                        "coalesce",
                        ["get", "name_alternativ"],
                        ["get", "name"],
                        ""
                    ]
                    ],
                    "Feuerwehr",
                    [
                    "coalesce",
                    ["get", "name"],
                    ["get", "name_alternativ"],
                    ""
                    ],
                    "Haus/Hütte",
                    [
                    "case",
                    [
                        "==",
                        ["get", "zustand"],
                        "Außer Betrieb, stillgelegt, verlassen"
                    ],
                    [
                        "format",
                        [
                        "coalesce",
                        [
                            "get",
                            "name_alternativ"
                        ],
                        ["get", "name"],
                        ""
                        ],
                        [
                        "concat",
                        " (",
                        ["get", "zustand"],
                        ")"
                        ],
                        {
                        "font-scale": 0.9,
                        "text-font": [
                            "literal",
                            ["Noto Sans Italic"]
                        ]
                        }
                    ],
                    [
                        "coalesce",
                        ["get", "name_alternativ"],
                        ["get", "name"],
                        ""
                    ]
                    ],
                    [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                    ]
                ]
                ],
                "text-font": ["Noto Sans Medium"],
                "text-radial-offset": 1.3,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-padding": 0,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": [
                "match",
                ["get", "klasse"],
                [
                    "Hochschule",
                    "Rathaus",
                    "Vermessungsamt",
                    "Landratsamt",
                    "Schule"
                ],
                "rgb(125, 22, 189)",
                [
                    "Krankenhaus",
                    "Polizei",
                    "Feuerwehr"
                ],
                "rgb(249,34,34)",
                [
                    "THW",
                    "Bad",
                    "Segeln/Surfen",
                    "Wohnmobilstellplatz",
                    "Wasserski"
                ],
                "rgb(14,75,185)",
                [
                    "Drachenflieger",
                    "Eislaufsport",
                    "Freizeitpark",
                    "Golfplatz",
                    "Hochseilgarten",
                    "Kletteranlage",
                    "Klettersteig",
                    "Museum",
                    "Sommerrodelbahn",
                    "Veranstaltungsort",
                    "Vogelpark",
                    "Wildgehege",
                    "Wildpark",
                    "Wildfütterung",
                    "Winterrodelbahn",
                    "Zoo"
                ],
                "rgb(5,150,97)",
                "rgb(51,51,51)"
                ],
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_POI_z12",
            "type": "symbol",
            "source": "zr",
            "source-layer": "POI_Punkt",
            "minzoom": 12,
            "layout": {
                "icon-image": [
                "image", ["get", "klasse"]
                ],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.5,
                20,
                1
                ],
                "icon-offset": [
                "match",
                ["get", "klasse"],
                ["Kirche"],
                ["literal", [0, -6]],
                ["literal", [0, 0]]
                ],
                "icon-padding": 0,
                "text-field": [
                "step",
                ["zoom"],
                "",
                15,
                [
                    "coalesce",
                    ["get", "name_alternativ"],
                    ["get", "name"],
                    ""
                ]
                ],
                "text-font": ["Noto Sans Medium"],
                "text-radial-offset": 1.3,
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                11,
                20,
                16
                ],
                "text-variable-anchor": [
                "left",
                "right"
                ],
                "text-padding": 0,
                "text-justify": "auto",
                "text-optional": true
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 1.5
            }
        });

        map.addLayer({
            "id": "zr_Name_BY_Waldname",
            "type": "symbol",
            "source": "by",
            "source-layer": "Name_Punkt_2",
            "minzoom": 13.5,
            "maxzoom": 18,
            "filter": [
                "all",
                [
                "==",
                ["get", "klasse"],
                "Waldname"
                ],
                ["has", "name"]
            ],
            "layout": {
                "symbol-sort-key": [
                "-",
                ["get", "texthoehe"]
                ],
                "text-field": [
                "to-string",
                ["get", "name"]
                ],
                "text-font": {
                "stops": [
                    [13, ["Noto Sans Regular"]],
                    [16, ["Noto Sans Bold"]]
                ]
                },
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                20
                ],
                "text-letter-spacing": 0.1,
                "text-variable-anchor": [
                "center",
                "left",
                "right",
                "top",
                "bottom"
                ]
            },
            "paint": {
                "text-color": "rgba(25, 139, 25, 1)",
                "text-halo-color": "rgb(255, 253, 238)",
                "text-halo-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13.5,
                1.2,
                18,
                2.5
                ],
                "text-halo-blur": 1
            }
        });

        map.addLayer({
            "id": "zr_Name_BY_Flurname",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_2",
            "minzoom": 13,
            "maxzoom": 18,
            "filter": [
                "all",
                [
                "==",
                ["get", "klasse"],
                "Flurname"
                ],
                ["has", "name"]
            ],
            "layout": {
                "symbol-sort-key": [
                "-",
                ["get", "texthoehe"]
                ],
                "text-field": [
                "to-string",
                ["get", "name"]
                ],
                "text-font": {
                "stops": [
                    [13, ["Noto Sans Regular"]],
                    [16, ["Noto Sans Bold"]]
                ]
                },
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                10,
                20,
                20
                ],
                "text-letter-spacing": 0.1,
                "text-variable-anchor": [
                "center",
                "left",
                "right",
                "top",
                "bottom"
                ]
            },
            "paint": {
                "text-color": "rgb(123, 49, 9)",
                "text-halo-color": "rgb(255, 253, 238)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        });

        map.addLayer({
            "id":"Gebaeudebezeichnung",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Gebaeudebezeichnung",
            "minzoom": 12,
            "maxzoom": 24,
            "layout": {
                "text-field": [
                "to-string",
                ["get", "name"]
                ],
                "text-font": ["Roboto Italic"],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,11,
                20,16,

                ],
                "text-variable-anchor": [
                "center",
                "bottom",
                "top"
                ],
                "visibility": "none"
            },
            "paint": {
                "text-color": "rgb(51,51,51)",
                "text-halo-blur": 1,
                "text-halo-color": "rgb(255,253,255)",
                "text-halo-width": 1.8
            }
        });

        map.addLayer({
            "id":"Hausnamen_Hausnummern",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Adresse_Alt",
            "minzoom": 15,
            "maxzoom": 24,
            "layout": {
                "text-field": [
                "to-string",
                ["concat",
                    ["get", "alte_hausnummer"],
                    "\n",
                    "\,\,",
                    ["get", "name"],
                    "\""
                ]],
                "text-font": ["Roboto Italic"],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,12,
                13,13,
                20,17,

                ],
                "text-anchor":"center",
                "visibility": "none"
            },
            "paint": {
                "text-color": "rgb(123, 49, 9)",
                "text-halo-blur": 1,
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1.8
            }
        });

        map.addLayer({
            "id": "zr_Bergname_Hoehenkote",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Reliefpunkt_2",
            "minzoom": 11,
            "maxzoom": 13.5,
            "filter": [
                "all",
                [
                "match",
                ["get", "klasse"],
                ["Höhenpunkt", "Bildstock"],
                true,
                false
                ],
                [
                "case",
                [">=", ["zoom"], 13],
                ["<=", ["get", "prio"], 2],
                ["==", ["get", "prio"], 1]
                ],
                ["has", "bergname"]
            ],
            "layout": {
                "text-field": [
                "to-string",
                ["get", "bergname"]
                ],
                "text-font": ["Roboto Italic"],
                "text-radial-offset": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                0.7,
                13,
                0.9,
                22,
                1.6
                ],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                12,
                13,
                [
                    "case",
                    ["==", ["get", "prio"], 1],
                    14,
                    13
                ],
                20,
                [
                    "case",
                    ["==", ["get", "prio"], 1],
                    17,
                    16
                ]
                ],
                "text-variable-anchor": [
                "bottom",
                "top",
                "bottom-left",
                "bottom-right",
                "top-left",
                "top-right"
                ]
            },
            "paint": {
                "text-color": "rgb(123,49,9)",
                "text-halo-blur": 1,
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1.8
            }
        });

        map.addLayer({
            "id": "zr_Hoehenkote",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Reliefpunkt_2",
            "minzoom": 12,
            "filter": [
                "all",
                [
                "match",
                ["get", "klasse"],
                ["Höhenpunkt", "Bildstock"],
                true,
                false
                ],
                ["has", "hoehe"],
                [
                "case",
                [">=", ["zoom"], 15],
                true,
                [">=", ["zoom"], 13],
                ["<=", ["get", "prio"], 2],
                ["==", ["get", "prio"], 1]
                ]
            ],
            "layout": {
                "text-field": [
                "to-string",
                ["get", "hoehe"]
                ],
                "text-font": ["Roboto Regular"],
                "text-radial-offset": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                0.7,
                13,
                0.9,
                22,
                1.6
                ],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                10,
                13,
                [
                    "case",
                    ["==", ["get", "prio"], 1],
                    12.33,
                    11.33
                ],
                20,
                [
                    "case",
                    ["==", ["get", "prio"], 1],
                    17,
                    16
                ]
                ],
                "text-variable-anchor": [
                "top",
                "top-left",
                "top-right",
                "bottom"
                ],
                "icon-image": [
                "step",
                ["zoom"],
                ["image", "Hoehenpunkt"],
                13.5,
                [
                    "match",
                    ["get", "klasse"],
                    ["Höhenpunkt"],
                    ["image", "Hoehenpunkt"],
                    ["image", "Bildstock"]
                ]
                ],
                "icon-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13.5,
                [
                    "case",
                    [
                    "==",
                    ["get", "klasse"],
                    "Bildstock"
                    ],
                    0.54,
                    0.4
                ],
                20,
                [
                    "case",
                    [
                    "==",
                    ["get", "klasse"],
                    "Bildstock"
                    ],
                    1,
                    0.4
                ]
                ],
                "icon-padding": 0,
                "text-line-height": 0.7,
                "text-padding": 0,
                "icon-offset": [
                "case",
                [
                    "==",
                    ["get", "klasse"],
                    "Bildstock"
                ],
                ["literal", [0, -8]],
                ["literal", [0, 0]]
                ]
            },
            "paint": {
                "text-color": "rgb(123,49,9)",
                "text-halo-color": "rgb(255,253,238)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
    });

        map.addLayer({
            "id": "zr_Name_Gemeindeteil_BY",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_2",
            "minzoom": 11,
            "filter": [
                "all",
                [
                "==",
                ["get", "klasse"],
                "Gmdteil"
                ],
                [
                "case",
                [
                    "==",
                    ["get", "name"],
                    "Münchener Haus"
                ],
                [">=", ["zoom"], 13.5],
                [">=", ["zoom"], 12],
                true,
                [
                    "match",
                    ["get", "art"],
                    [
                    "Gemeindeteil: 20 - 200",
                    "Gemeindeteil: 200 - 1000",
                    "Gemeindeteil: 1000 - 5000",
                    "Gemeindeteil: 5000 - 20000"
                    ],
                    true,
                    false
                ]
                ],
                ["has", "name"]
            ],
            "layout": {
                "symbol-sort-key": [
                "-",
                ["get", "texthoehe"]
                ],
                "text-field": [
                "case",
                [
                    "all",
                    ["has", "zusatz"],
                    [
                    "match",
                    ["get", "zusatz"],
                    [
                        "Gut",
                        "(verfallen)",
                        "(abgebrochen)"
                    ],
                    true,
                    false
                    ]
                ],
                [
                    "format",
                    ["get", "name"],
                    {},
                    "\n",
                    {},
                    ["get", "zusatz"],
                    {
                    "font-scale": 0.9,
                    "text-font": [
                        "literal",
                        ["Roboto Italic"]
                    ]
                    }
                ],
                ["has", "zusatz"],
                [
                    "concat",
                    ["get", "name"],
                    " ",
                    ["get", "zusatz"]
                ],
                ["get", "name"]
                ],
                "text-font": [
                "step",
                ["zoom"],
                [
                    "match",
                    ["get", "art"],
                    [
                    "Gemeindeteil: 1000 - 5000",
                    "Gemeindeteil: 5000 - 20000"
                    ],
                    ["literal", ["Roboto Medium"]],
                    ["literal", ["Roboto Regular"]]
                ],
                15,
                [
                    "match",
                    ["get", "art"],
                    [
                    "Gemeindeteil: 1000 - 5000",
                    "Gemeindeteil: 5000 - 20000"
                    ],
                    ["literal", ["Roboto Bold"]],
                    ["literal", ["Roboto Medium"]]
                ]
                ],
                "text-letter-spacing": [
                "case",
                [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 0 - 20"
                ],
                0.03,
                0
                ],
                "text-max-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                6,
                15,
                8
                ],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 0 - 20"
                    ],
                    10,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 20 - 200"
                    ],
                    11,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 200 - 1000"
                    ],
                    12,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 1000 - 5000"
                    ],
                    13,
                    13
                ],
                20,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 0 - 20"
                    ],
                    18,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 20 - 200"
                    ],
                    20,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 200 - 1000"
                    ],
                    23,
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 1000 - 5000"
                    ],
                    27,
                    30
                ]
                ],
                "text-anchor": [
                "match",
                ["get", "ausrichtung"],
                [0],
                "top-left",
                [1],
                "left",
                [2],
                "bottom-left",
                [6],
                "top",
                [7],
                "center",
                [8],
                "bottom",
                [12],
                "top-right",
                [13],
                "right",
                [14],
                "bottom-right",
                "center"
                ]
            },
            "paint": {
                "text-opacity": [
                "step",
                ["zoom"],
                1,
                11.5,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 20 - 200"
                    ],
                    0,
                    1
                ],
                12,
                1
                ],
                "text-color": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Gemeindeteil: 0 - 20"
                    ],
                    "rgb(102,102,102)",
                    "rgb(51, 51, 51)"
                ],
                15,
                "rgb(51, 51, 51)"
                ],
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 2
            }
        });

        map.addLayer({
            "id": "zr_Name_Landgemeinde_BY",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_2",
            "minzoom": 10,
            "filter": [
                "all",
                [
                "==",
                ["get", "klasse"],
                "Landgem"
                ],
                ["has", "name"]
            ],
            "layout": {
                "symbol-sort-key": [
                "-",
                ["get", "texthoehe"]
                ],
                "text-field": [
                "step",
                ["zoom"],
                "",
                10,
                [
                    "case",
                    [
                    "all",
                    ["has", "zusatz"],
                    [
                        "match",
                        ["get", "zusatz"],
                        [
                        "Gut",
                        "(verfallen)",
                        "(abgebrochen)"
                        ],
                        true,
                        false
                    ]
                    ],
                    [
                    "format",
                    ["get", "name"],
                    {},
                    "\n",
                    {},
                    ["get", "zusatz"],
                    {"font-scale": 0.9}
                    ],
                    ["has", "zusatz"],
                    [
                    "concat",
                    ["get", "name"],
                    " ",
                    ["get", "zusatz"]
                    ],
                    ["get", "name"]
                ],
                14,
                [
                    "case",
                    [
                    "all",
                    ["has", "zusatz"],
                    [
                        "match",
                        ["get", "zusatz"],
                        [
                        "Gut",
                        "(verfallen)",
                        "(abgebrochen)"
                        ],
                        true,
                        false
                    ]
                    ],
                    [
                    "format",
                    ["get", "name"],
                    {},
                    "\n",
                    {},
                    ["get", "zusatz"],
                    {"font-scale": 0.9}
                    ],
                    ["has", "zusatz"],
                    [
                    "concat",
                    ["get", "name"],
                    " ",
                    ["get", "zusatz"]
                    ],
                    ["has", "zweitname"],
                    ["get", "zweitname"],
                    ["get", "name"]
                ]
                ],
                "text-font": ["Roboto Bold"],
                "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 0 - 1000"
                    ],
                    12,
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 1000 - 5000"
                    ],
                    13,
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 5000 - 20000"
                    ],
                    13,
                    13.5
                ],
                20,
                [
                    "case",
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 0 - 1000"
                    ],
                    23,
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 1000 - 5000"
                    ],
                    27,
                    [
                    "==",
                    ["get", "art"],
                    "Landgemeinde: 5000 - 20000"
                    ],
                    30,
                    30
                ]
                ],
                "text-anchor": [
                "match",
                ["get", "ausrichtung"],
                [0],
                "top-left",
                [1],
                "left",
                [2],
                "bottom-left",
                [6],
                "top",
                [7],
                "center",
                [8],
                "bottom",
                [12],
                "top-right",
                [13],
                "right",
                [14],
                "bottom-right",
                "center"
                ]
            },
            "paint": {
                "text-color": "rgb(51, 51, 51)",
                "text-halo-blur": 0.5,
                "text-halo-color": "rgb(255, 255, 255)",
                "text-halo-width": 2
            }
        });

        map.addLayer({
            "id": "zr_Name_Punkt_2_Klein",
            "type": "symbol",
            "source": "zr",
            "source-layer": "Name_Punkt_2",
            "minzoom": 13.5,
            "maxzoom": 19,
            "filter": [
                "match",
                ["get", "klasse"],
                [
                "Bergname Gebogen",
                "Kleinräume kleiner 0.5qkm"
                ],
                [
                "case",
                [">=", ["zoom"], 18],
                ["<", ["get", "laufweite"], 50],
                [">=", ["zoom"], 17],
                ["<", ["get", "laufweite"], 100],
                [">=", ["zoom"], 16],
                ["<", ["get", "laufweite"], 200],
                [">=", ["zoom"], 15],
                ["<", ["get", "laufweite"], 400],
                true
                ],
                false
            ],
            "layout": {
                "symbol-sort-key": [
                "-",
                ["get", "texthoehe"]
                ],
                "text-font": {
                "stops": [
                    [13, ["Roboto Regular"]],
                    [16, ["Roboto Bold"]]
                ]
                },
                "text-field": [
                "to-string",
                ["get", "name"]
                ],
                "text-anchor": [
                "match",
                ["get", "ausrichtung"],
                [0],
                "top-left",
                [1],
                "left",
                [2],
                "bottom-left",
                [6],
                "top",
                [7],
                "center",
                [8],
                "bottom",
                [12],
                "top-right",
                [13],
                "right",
                [14],
                "bottom-right",
                "center"
                ],
                "text-radial-offset": [
                "interpolate",
                ["linear"],
                ["zoom"],
                11,
                1,
                14,
                0.5,
                22,
                1.5
                ],
                "text-allow-overlap": true,
                "text-padding": 0,
                "text-rotate": [
                "*",
                ["get", "rotation"],
                -1
                ],
                "text-size": [
                "*",
                ["get", "texthoehe"],
                0.35
                ],
                "text-rotation-alignment": "map",
                "text-pitch-alignment": "map",
                "text-line-height": 0.8
            },
            "paint": {
                "text-color": "#7B3109",
                "text-halo-color": "#FFFDEE",
                "text-halo-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13.5,
                1.4,
                18,
                3
                ],
                "text-halo-blur": 1
            }
        });

        map.addLayer({
            "id": "hintergrund2",
            "type": "fill",
            "source": "zr",
            "source-layer": "Hintergrund2",
            "minzoom": 6,
            "paint": {
                "fill-color":"rgba(240, 240, 240, 0.5)"}
            }
        );

        map.addLayer({
            "id": "hintergrund_kontur",
            "type": "line",
            "source": "zr",
            "source-layer": "Hintergrund",
            "minzoom": 6,
            "paint": {
                "line-color": "rgb(123, 49, 9)",
                "line-width":1.5
            }
        });

    updateMap();
    });